<?php

use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\WishController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/* Public */
Route::middleware('throttle:10,1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
});

Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{slug}/books', [CategoryController::class, 'books']);
Route::get('books', [BookController::class, 'index']);
Route::get('books/highlights', [BookController::class, 'highlights']);
Route::get('books/{id}', [BookController::class, 'show'])->whereNumber('id');

/* Authenticated users */
Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('me', [AuthController::class, 'updateProfile']);

    Route::get('my/books', [BookController::class, 'mine']);
    Route::post('books', [BookController::class, 'store']);
    // POST because PHP only parses multipart bodies (cover upload) on POST requests.
    Route::post('books/{id}', [BookController::class, 'update'])->whereNumber('id');
    Route::patch('books/{id}/quantity', [BookController::class, 'updateQuantity'])->whereNumber('id');
    Route::delete('books/{id}', [BookController::class, 'destroy'])->whereNumber('id');

    Route::get('wishlist', [WishController::class, 'index']);
    Route::post('wishlist', [WishController::class, 'store']);
    Route::delete('wishlist/{bookId}', [WishController::class, 'destroy'])->whereNumber('bookId');

    /* Administrators */
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('stats', [AdminController::class, 'stats']);

        Route::get('books', [AdminController::class, 'books']);
        Route::patch('books/{id}/request', [AdminController::class, 'updateRequest'])->whereNumber('id');

        Route::get('categories', [AdminController::class, 'categories']);
        Route::post('categories', [AdminController::class, 'storeCategory']);
        Route::put('categories/{id}', [AdminController::class, 'updateCategory'])->whereNumber('id');
        Route::delete('categories/{id}', [AdminController::class, 'destroyCategory'])->whereNumber('id');

        Route::get('users', [AdminController::class, 'users']);
        Route::put('users/{id}/role', [AdminController::class, 'updateRole'])->whereNumber('id');
    });
});
