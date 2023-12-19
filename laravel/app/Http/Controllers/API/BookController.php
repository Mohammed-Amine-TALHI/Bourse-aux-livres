<?php

namespace App\Http\Controllers\API;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;

class BookController extends Controller
{
    //


    public function index ()
    {
        $books = Book::all();
        return response()->json([
            'status'=>200,
            'Products'=>$books
        ]);
    }
    public function update (Request $request,$id){
        $validator = Validator ::make($request->all(),[
            'meta_title'=> 'required|max:191',
            'isbn'=> 'required|max:191',
            'category_id'=>'required|max:191',
            'book_title'=>'required|max:191',
            //'cover_image'=>'required|image|mimes:jpeg,png,jpg|max:2048',
            'genre'=>'required|max:191',
            'selling_price'=>'required|max:191',
            'original_price'=>'required|max:191',
            'qty'=>'required|max:191',
            'description' =>'required|max:500',
        ]);

        if($validator -> fails()){
            return response()->json([
                'status'=> 422,
                'errors' => $validator -> messages(),
            ]);
        }
        else{

            $book = Book::find($id);
            if($book)
            {

            
                $sellerId = auth()->id();
                $book->seller_id = $sellerId;
                $book-> school_name = $request ->input('school_name');
                $book -> category_id = $request ->input('category_id');
                $book -> book_title = $request ->input('book_title');
                $book -> isbn = $request ->input('isbn');
                $book -> description = $request ->input('description');
                $book -> meta_title = $request ->input('meta_title');
                $book -> meta_keyword = $request ->input('meta_keyword');
                $book -> meta_descrip = $request ->input('meta_descrip');
                $book -> author = $request ->input('author');
                $book -> genre = $request ->input('genre');
                $book -> published_date = $request ->input('published_date');
                $book -> original_price = $request ->input('original_price');
                $book -> selling_price = $request ->input('selling_price');
                $book -> qty = $request ->input('qty');





                
                if($request -> hasFile('cover_image'))
                {
                    $path = $book -> cover_image ;
                    if(File::exists($path))
                    {
                        File::delete($path);
                    }
                    $file = $request->file('cover_image');
                    $extension = $file->getClientOriginalExtension();
                    $filename = time() . '.' .$extension;
                    $file->move('uploads/books/', $filename);
                    $book -> cover_image = 'uploads/books/'.$filename;
                }
                /*if ($request->hasFile('cover_image')) {
                    $file = $request->file('cover_image');
                
                    // Check for errors
                    if ($file->getError() == UPLOAD_ERR_OK) {
                        $extension = $file->getClientOriginalExtension();
                        $filename = time() . '.' . $extension;
                
                        // Move the file
                        $file->move(public_path('uploads/books/'), $filename);
                        $book->cover_image = 'uploads/books/' . $filename;
                    } else {
                        // Log or handle the error
                        \Log::error('File upload error: ' . $file->getErrorMessage());
                    }
                }*/
                

                $book -> featured = $request ->input('featured') ;
                $book -> popular = $request ->input('popular') ;
                $book -> status = $request ->input('status');
                $book -> update();
                
                    return response()->json([
                        'status'=> 200,
                        'message' => 'Book Updated Successfully',
                    ]);
            }
            else 
            {
                return response()->json([
                    'status'=> 404,
                    'message' => 'Book Not Found',
                ]);   
            }
        }
    }
    public function edit($id)
    {
        $book = Book::find($id);
        if ($book)
        {
            return response()->json([
                'status'=> 200,
                'book'=> $book,
            ]);
        }
        else 
        {
            return response()->json([
                'status'=> 404,
                'message'=> 'No Book Found',
            ]);
        }
    }


    public function store(Request $request){

        $validator = Validator ::make($request->all(),[
            'meta_title'=> 'required|max:191',
            'isbn'=> 'required|max:191',
            'category_id'=>'required|max:191',
            'book_title'=>'required|max:191',
            'cover_image'=>'required|image|mimes:jpeg,png,jpg|max:2048',
            'genre'=>'required|max:191',
            'selling_price'=>'required|max:191',
            'original_price'=>'required|max:191',
            'qty'=>'required|max:191',
            'description' =>'required|max:500',
        ]);

        if($validator -> fails()){
            return response()->json([
                'status'=> 422,
                'errors' => $validator -> messages(),
            ]);
        }
        else{
            $book = new Book;
            \Log::info('Request Data:', $request->all());
            $sellerId = auth()->id();
            $book->seller_id = $sellerId;
            $book-> school_name = $request ->input('school_name');
            $book -> category_id = $request ->input('category_id');
            $book -> book_title = $request ->input('book_title');
            $book -> isbn = $request ->input('isbn');
            $book -> description = $request ->input('description');
            $book -> meta_title = $request ->input('meta_title');
            $book -> meta_keyword = $request ->input('meta_keyword');
            $book -> meta_descrip = $request ->input('meta_descrip');
            $book -> author = $request ->input('author');
            $book -> genre = $request ->input('genre');
            $book -> published_date = $request ->input('published_date');
            $book -> original_price = $request ->input('original_price');
            $book -> selling_price = $request ->input('selling_price');
            $book -> qty = $request ->input('qty');





            
            if($request -> hasFile('cover_image'))
            {
                $file = $request->file('cover_image');
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '.' .$extension;
                $file->move('uploads/books/', $filename);
                $book -> cover_image = 'uploads/books/'.$filename;
            }
            /*if ($request->hasFile('cover_image')) {
                $file = $request->file('cover_image');
            
                // Check for errors
                if ($file->getError() == UPLOAD_ERR_OK) {
                    $extension = $file->getClientOriginalExtension();
                    $filename = time() . '.' . $extension;
            
                    // Move the file
                    $file->move(public_path('uploads/books/'), $filename);
                    $book->cover_image = 'uploads/books/' . $filename;
                } else {
                    // Log or handle the error
                    \Log::error('File upload error: ' . $file->getErrorMessage());
                }
            }*/
            

            $book -> featured = $request ->input('featured') == true ? '1':'0';
            $book -> popular = $request ->input('popular') == true ? '1':'0';
            $book -> status = $request ->input('status') == true ? '1':'0';
            $book -> save();
            
                return response()->json([
                    'status'=> 200,
                    'message' => 'Book Added Successfully',
                ]);
            
        }

    }
}
