<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\BookController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('login', [AuthController::class,'login']);
Route::post('register', [AuthController::class,'register']);

Route::group(['middleware'=>'api'],function(){
Route::post('logout', [AuthController::class,'logout']);
Route::post('refresh', [AuthController::class,'refresh']);
Route::post('me', [AuthController::class,'me']);


Route::get('view-category',[CategoryController::class,'index']);
Route::get('edit-category/{id}',[CategoryController::class,'edit']);
Route::post('store-category',[CategoryController::class,'store']);
Route::put('update-gategory/{id}',[CategoryController::class,'update']);
Route::delete('delete-category/{id}',[CategoryController::class,'destroy']);
Route::get('all-category',[CategoryController::class,'allcategory']);


Route::post('store-book',[BookController::class,'store']);

});


