<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Book;

class Wish extends Model
{
    use HasFactory;
    protected $table = 'wish';
    protected $fillable = [
        'user_id',
        'book_id',
    ];

    protected $with =['book','user'];
    public function book()
    {
        return $this->belongsTo(Book::class,'book_id','id');
    }
    public function user()
    {
        return $this->belongsTo(User::class,'user_id','id');
    }

}
