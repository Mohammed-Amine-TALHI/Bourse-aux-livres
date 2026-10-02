<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'books' => Book::count(),
                'pending' => Book::where('request', Book::PENDING)->count(),
                'approved' => Book::where('request', Book::APPROVED)->count(),
                'rejected' => Book::where('request', Book::REJECTED)->count(),
                'users' => User::count(),
                'categories' => Category::count(),
            ],
            'pending' => Book::where('request', Book::PENDING)->oldest()->get(),
        ]);
    }

    /* ----------------------------------------------------------------- Books */

    public function books(): JsonResponse
    {
        return response()->json(['books' => Book::latest()->get()]);
    }

    /**
     * Approve, reject or put a listing back in the review queue.
     */
    public function updateRequest(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'request' => ['required', 'integer', Rule::in([Book::PENDING, Book::APPROVED, Book::REJECTED])],
        ]);

        $book = Book::findOrFail($id);
        $book->request = $data['request'];
        $book->save();

        return response()->json([
            'message' => 'Request status updated.',
            'book' => $book,
        ]);
    }

    /* ------------------------------------------------------------ Categories */

    public function categories(): JsonResponse
    {
        return response()->json([
            'categories' => Category::withCount('books')->orderBy('name')->get(),
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $category = Category::create($this->validateCategory($request));

        return response()->json([
            'message' => 'Category added.',
            'category' => $category,
        ], 201);
    }

    public function updateCategory(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->update($this->validateCategory($request, $category));

        return response()->json([
            'message' => 'Category updated.',
            'category' => $category,
        ]);
    }

    public function destroyCategory(int $id): JsonResponse
    {
        $category = Category::withCount('books')->findOrFail($id);

        if ($category->books_count > 0) {
            return response()->json([
                'message' => 'This category still contains books. Move or delete them first, or hide the category.',
            ], 409);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }

    protected function validateCategory(Request $request, ?Category $category = null): array
    {
        $request->merge([
            'slug' => Str::slug($request->input('slug') ?: $request->input('name', '')),
        ]);

        $data = $request->validate([
            'name' => 'required|string|max:191',
            'slug' => ['required', 'string', 'max:191', Rule::unique('categories', 'slug')->ignore($category?->id)],
            'description' => 'nullable|string|max:1000',
            'status' => 'nullable|boolean',
        ]);

        $data['status'] = $request->boolean('status') ? Category::HIDDEN : Category::VISIBLE;

        return $data;
    }

    /* ----------------------------------------------------------------- Users */

    public function users(): JsonResponse
    {
        return response()->json([
            'users' => User::withCount('books')->orderBy('name')->get(),
        ]);
    }

    public function updateRole(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'role' => 'required|in:admin,user',
        ]);

        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot change your own role.'], 422);
        }

        $user->role = $data['role'];
        $user->save();

        return response()->json([
            'message' => 'User role updated.',
            'user' => $user,
        ]);
    }
}
