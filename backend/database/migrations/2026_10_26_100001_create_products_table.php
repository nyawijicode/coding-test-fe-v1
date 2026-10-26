<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('external_id')->unique();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('category', 100)->index();
            $table->string('brand', 120)->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->text('thumbnail')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
        });

        if (in_array(DB::connection()->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE products ADD FULLTEXT products_title_fulltext (title)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
