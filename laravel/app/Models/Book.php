<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Book extends Model
{
    use HasFactory;
    protected $table = 'books';
    protected $fillable = [
        'category_id',
        'meta_title',
        'meta_keyword',
        'meta_descrip',
        'isbn',
        'school_name',
        'book_title',
        'description',
        'status',
        'author',
        'published_date',
        'selling_price',
        'original_price',
        'genre',
        'qty',
        'cover_image',
        'featured',
        'popular',
        'description',
    ];
    protected $with = ['category'];
    public function category()
    {
        return $this->belongsTo(Category::class,'category_id','id');
    }
}
