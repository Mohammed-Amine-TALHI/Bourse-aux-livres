<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;

class Book extends Model
{
    use HasFactory;

    public const VISIBLE = 0;

    public const HIDDEN = 1;

    public const PENDING = 0;

    public const APPROVED = 1;

    public const REJECTED = 2;

    public const COVER_DIR = 'uploads/books';

    protected $table = 'books';

    protected $fillable = [
        'category_id',
        'book_title',
        'author',
        'isbn',
        'school_name',
        'genre',
        'description',
        'selling_price',
        'original_price',
        'qty',
    ];

    protected $casts = [
        'seller_id' => 'integer',
        'category_id' => 'integer',
        'selling_price' => 'float',
        'original_price' => 'float',
        'qty' => 'integer',
        'featured' => 'boolean',
        'popular' => 'boolean',
        'status' => 'integer',
        'request' => 'integer',
    ];

    protected $with = ['category:id,name,slug,status', 'seller:id,name'];

    protected $appends = ['cover_url'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function wishes()
    {
        return $this->hasMany(Wish::class, 'book_id');
    }

    /**
     * Books anyone can see: approved by an admin, not hidden, in a visible category.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('request', self::APPROVED)
            ->where('status', self::VISIBLE)
            ->whereHas('category', fn (Builder $q) => $q->visible());
    }

    public function isPublished(): bool
    {
        return $this->request === self::APPROVED
            && $this->status === self::VISIBLE
            && $this->category?->status === Category::VISIBLE;
    }

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image ? asset($this->cover_image) : null;
    }

    public function deleteCover(): void
    {
        if ($this->cover_image && File::exists(public_path($this->cover_image))) {
            File::delete(public_path($this->cover_image));
        }
    }
}
