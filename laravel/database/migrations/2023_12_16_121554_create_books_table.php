<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories');
            $table->string('book_title');
            $table->string('author')->nullable();
            $table->string('isbn', 32)->nullable();
            $table->string('school_name')->nullable();
            $table->string('genre')->nullable();
            $table->text('description');
            $table->decimal('selling_price', 8, 2);
            $table->decimal('original_price', 8, 2)->nullable();
            $table->unsignedInteger('qty')->default(1);
            $table->string('cover_image')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('popular')->default(false);
            $table->tinyInteger('status')->default(0)->comment('0=visible, 1=hidden');
            $table->tinyInteger('request')->default(0)->comment('0=pending, 1=approved, 2=rejected');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
