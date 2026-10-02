<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public const VISIBLE = 0;

    public const HIDDEN = 1;

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public function books()
    {
        return $this->hasMany(Book::class, 'category_id');
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('status', self::VISIBLE);
    }
}
