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
            $table->foreignId('seller_id')->default(1)->constrained('users');

            $table->integer('category_id');
            $table->bigInteger('isbn');
            $table->string('book_title');
            $table->longText('description');

            $table->string('meta_title')->nullable();
            $table->string('school_name')->nullable();
            $table->mediumText('meta_keyword')->nullable();
            $table->mediumText('meta_descrip')->nullable();

            $table->string('author')->nullable();
            $table->date('published_date')->nullable();
            $table->string('selling_price');
            $table->string('original_price');
            $table->string('genre');
            $table->string('qty');
            $table->string('cover_image')->nullable();
            $table->tinyInteger('featured')->default('0')->nullable();
            $table->tinyInteger('popular')->default('0')->nullable();
            $table->tinyInteger('status')->default('0');
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
