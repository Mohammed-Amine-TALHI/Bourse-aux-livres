<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class BookController extends Controller
{
    /**
     * Public catalogue: only approved, visible books.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'books' => Book::published()->latest()->get(),
        ]);
    }

    /**
     * Everything the home page needs in a single call.
     */
    public function highlights(): JsonResponse
    {
        return response()->json([
            'popular' => Book::published()->where('popular', true)->latest()->take(10)->get(),
            'featured' => Book::published()->where('featured', true)->latest()->take(10)->get(),
            'latest' => Book::published()->latest()->take(10)->get(),
            'stats' => [
                'books' => Book::published()->count(),
                'sellers' => Book::published()->distinct()->count('seller_id'),
                'categories' => Category::visible()->count(),
            ],
        ]);
    }

    /**
     * A single book. Unpublished books are only visible to their seller and to admins,
     * and the seller's phone number is only shared with logged-in users.
     */
    public function show(int $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        $user = auth()->user();

        if (! $book->isPublished() && ! $this->canManage($user, $book)) {
            abort(404);
        }

        $related = Book::published()
            ->where('category_id', $book->category_id)
            ->where('id', '!=', $book->id)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'book' => $book,
            'seller_phone' => $user ? User::whereKey($book->seller_id)->value('phonenumber') : null,
            'in_wishlist' => $user ? $user->wishes()->where('book_id', $book->id)->exists() : false,
            'can_manage' => $this->canManage($user, $book),
            'related' => $related,
        ]);
    }

    /**
     * The books the authenticated user is selling.
     */
    public function mine(): JsonResponse
    {
        return response()->json([
            'books' => Book::where('seller_id', auth()->id())->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();
        $data = $this->validateBook($request);

        $book = new Book($data);
        $book->seller_id = $user->id;
        // Listings from students wait for an admin review; admins publish directly.
        $book->request = $user->isAdmin() ? Book::APPROVED : Book::PENDING;
        $this->applyFlags($book, $request, $user);

        if ($request->hasFile('cover_image')) {
            $book->cover_image = $this->storeCover($request->file('cover_image'));
        }

        $book->save();

        return response()->json([
            'message' => $user->isAdmin()
                ? 'Book published.'
                : 'Book submitted. It will be visible once an admin approves it.',
            'book' => $book->fresh(),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        $user = auth()->user();
        $this->authorizeManage($user, $book);

        $book->fill($this->validateBook($request));
        $this->applyFlags($book, $request, $user);

        if ($request->hasFile('cover_image')) {
            $book->deleteCover();
            $book->cover_image = $this->storeCover($request->file('cover_image'));
        }

        $book->save();

        return response()->json([
            'message' => 'Book updated.',
            'book' => $book->fresh(),
        ]);
    }

    public function updateQuantity(Request $request, int $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        $this->authorizeManage(auth()->user(), $book);

        $data = $request->validate([
            'quantity' => 'required|integer|min:0|max:999',
        ]);

        $book->qty = $data['quantity'];
        $book->save();

        return response()->json([
            'message' => 'Quantity updated.',
            'book' => $book,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        $this->authorizeManage(auth()->user(), $book);

        $book->deleteCover();
        $book->delete();

        return response()->json(['message' => 'Book deleted.']);
    }

    protected function validateBook(Request $request): array
    {
        return $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'book_title' => 'required|string|max:191',
            'author' => 'nullable|string|max:191',
            'isbn' => ['nullable', 'string', 'max:32', 'regex:/^[0-9Xx\- ]+$/'],
            'school_name' => 'nullable|string|max:191',
            'genre' => 'nullable|string|max:191',
            'description' => 'required|string|max:2000',
            'selling_price' => 'required|numeric|min:0|max:99999',
            'original_price' => 'nullable|numeric|min:0|max:99999',
            'qty' => 'required|integer|min:0|max:999',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);
    }

    /**
     * Sellers can hide their own listing; only admins can promote a book on the home page.
     */
    protected function applyFlags(Book $book, Request $request, User $user): void
    {
        if ($request->has('status')) {
            $book->status = $request->boolean('status') ? Book::HIDDEN : Book::VISIBLE;
        }

        if ($user->isAdmin()) {
            if ($request->has('featured')) {
                $book->featured = $request->boolean('featured');
            }
            if ($request->has('popular')) {
                $book->popular = $request->boolean('popular');
            }
        }
    }

    protected function storeCover(UploadedFile $file): string
    {
        $filename = Str::uuid().'.'.$file->extension();
        $file->move(public_path(Book::COVER_DIR), $filename);

        return Book::COVER_DIR.'/'.$filename;
    }

    protected function canManage(?User $user, Book $book): bool
    {
        return $user !== null && ($user->isAdmin() || $user->id === $book->seller_id);
    }

    protected function authorizeManage(?User $user, Book $book): void
    {
        abort_unless($this->canManage($user, $book), 403, 'You can only manage your own books.');
    }
}
