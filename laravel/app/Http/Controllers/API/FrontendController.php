<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Book;

class FrontendController extends Controller
{

  public function viewBook($category,$id){

    $category = Category::where('slug',$category)->where('status','0')->first();
      if($category)
      {
        $book = Book::where('category_id',$category->id)
                      ->where('id',$id)
                      ->where('status','0')
                      ->first();
        if($book){

          return response()->json([
            'status'=>200,
            'book'=>$book,
            
          ]);

        }else {

          return response()->json([
            'status'=>400,
            'message'=>'No Book Available'
          ]);
        }
      }else{

         return response()->json([
              'status'=>404,
              'message'=>'No Such Category Found'
         ]);
      }
    }


    public function book($slug)
    {
      $category = Category::where('slug',$slug)->where('status','0')->first();
      if($category)
      {
        $book = Book::where('category_id',$category->id)->where('status','0')->get();
        if($book){

          return response()->json([
            'status'=>200,
            'book_data'=>[
                'book'=>$book,
                'category'=>$category,
            ]
          ]);

        }else {

          return response()->json([
            'status'=>400,
            'message'=>'No Book Available'
          ]);
        }
      }else{

         return response()->json([
              'status'=>404,
              'message'=>'No Such Category Found'
         ]);
      }
    }

    public function indexSlider(){
      $bookP = Book::where('popular','1')->get();
      $bookF = Book::where('featured','1')->get();

        return response()->json([
            'status'=>200,
            'bookP'=>$bookP,
            'bookF'=>$bookF,

        ]);
    }

    public function index(){
      $book = Book::where('status','0')->get();


        return response()->json([
            'status'=>200,
            'books'=>$book,

        ]);
    }

    public function category (){
      $category = Category :: where('status','O')->get();
      return response()->json([
        'status'=>200,
        'category'=>$category,

    ]);  
    }
}
