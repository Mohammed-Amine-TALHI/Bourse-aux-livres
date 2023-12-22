<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Wish;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishController extends Controller
{
    public function wish(Request $request)
    {
        if (Auth::check()) {
            $user_id = Auth::user()->id;
            $book_id = $request->book_id;

            // Check if the book exists
            $bookCheck = Book::find($book_id);

            if ($bookCheck) {
                // Check if the book is already in the wishlist
                if (Wish::where('book_id', $book_id)->where('user_id', $user_id)->exists()) {
                    return response()->json([
                        'status' => 409,
                        'message' => $bookCheck->book_title . ' is already in the Wishlist.'
                    ]);
                } else {
                    // Add the book to the wishlist
                    $wishItem = new Wish;
                    $wishItem->user_id = $user_id;
                    $wishItem->book_id = $book_id;
                    $wishItem->save();

                    return response()->json([
                        'status' => 201,
                        'message' => 'Added to Wishlist.'
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 404,
                    'message' => 'Book not found.'
                ]);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Login to add to Wishlist.'
            ]);
        }
    }
}
