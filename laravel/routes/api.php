<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WishController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\BookController;
use App\Http\Controllers\API\FrontendController;
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
Route::get('getCategory',[FrontendController::class,'category']);
Route::get('fetchbooks/{slug}',[FrontendController::class,'book']);
Route::get('collections/{category}/{id}',[FrontendController::class,'viewBook']);
Route::get('Books-slider',[FrontendController::class,'indexSlider']);
Route::get('Books',[FrontendController::class,'index']);
Route::post('add-to-wish',[WishController::class,'wish']);
Route::get('wish-List',[WishController::class,'Viewish']);
Route::delete('dalate-wish/{wish_id}',[WishController::class,'delete']);


Route::group(['middleware'=>'api'],function(){
Route::post('logout', [AuthController::class,'logout']);
Route::post('refresh', [AuthController::class,'refresh']);
Route::post('me', [AuthController::class,'me']);
Route::get('users', [AuthController::class,'index']);



Route::get('view-category',[CategoryController::class,'index']);
Route::get('edit-category/{id}',[CategoryController::class,'edit']);
Route::post('store-category',[CategoryController::class,'store']);
Route::put('update-gategory/{id}',[CategoryController::class,'update']);
Route::delete('delete-category/{id}',[CategoryController::class,'destroy']);
Route::get('all-category',[CategoryController::class,'allcategory']);


Route::post('store-book',[BookController::class,'store']);
Route::get('view-books',[BookController::class,'index']);
Route::get('view-requestbooks',[BookController::class,'indexRequest']);
Route::get('edit-book/{id}',[BookController::class,'edit']);
Route::patch('/update-request-status/{id}', [BookController::class, 'updateRequestStatus']);
Route::post('update-book/{id}',[BookController::class,'update']);
Route::patch('update-quantity/{id}',[BookController::class,'updateQty']);
Route::put('users/{id}/update-role', [AuthController::class, 'updateRole']);


});


