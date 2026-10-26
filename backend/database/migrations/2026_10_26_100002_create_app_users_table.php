<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('external_id')->unique();
            $table->string('first_name', 120);
            $table->string('last_name', 120)->nullable();
            $table->string('email')->index();
            $table->string('phone', 40)->nullable();
            $table->text('avatar')->nullable();
            $table->string('company_name', 160)->nullable();
            $table->string('city', 120)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_users');
    }
};
