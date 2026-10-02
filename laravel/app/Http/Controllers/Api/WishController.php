<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Wish;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishController extends Controller
{
    /**
     * The books saved by the authenticated user.
     */
    public function index(): JsonResponse
    {
        $books = Book::published()
            ->whereHas('wishes', fn ($q) => $q->where('user_id', auth()->id()))
            ->get();

        return response()->json(['books' => $books]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'book_id' => 'required|integer',
        ]);

        $book = Book::published()->findOrFail($data['book_id']);

        $wish = Wish::firstOrCreate([
            'user_id' => auth()->id(),
            'book_id' => $book->id,
        ]);

        return response()->json([
            'message' => $wish->wasRecentlyCreated
                ? 'Added to your wishlist.'
                : $book->book_title.' is already in your wishlist.',
        ], $wish->wasRecentlyCreated ? 201 : 200);
    }

    public function destroy(int $bookId): JsonResponse
    {
        Wish::where('user_id', auth()->id())->where('book_id', $bookId)->delete();

        return response()->json(['message' => 'Removed from your wishlist.']);
    }
}
