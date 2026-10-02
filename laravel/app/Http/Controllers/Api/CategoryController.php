<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Visible categories with the number of books currently on sale in each.
     */
    public function index(): JsonResponse
    {
        $categories = Category::visible()
            ->withCount(['books' => fn ($q) => $q
                ->where('request', Book::APPROVED)
                ->where('status', Book::VISIBLE)])
            ->orderBy('name')
            ->get();

        return response()->json(['categories' => $categories]);
    }

    /**
     * A category and the books on sale in it.
     */
    public function books(string $slug): JsonResponse
    {
        $category = Category::visible()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'category' => $category,
            'books' => Book::published()->where('category_id', $category->id)->latest()->get(),
        ]);
    }
}
