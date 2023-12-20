<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Book;

class FrontendController extends Controller
{

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


    public function category (){
      $category = Category :: where('status','O')->get();
      return response()->json([
        'status'=>200,
        'category'=>$category,

    ]);  
    }
}
