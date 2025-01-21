<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        // ใช้ Schema::create เพื่อสร้างตาราง `chirps`
        Schema::create('chirps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('message');
            $table->timestamps();
            $table->string('photo')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chirps');
    }
};
