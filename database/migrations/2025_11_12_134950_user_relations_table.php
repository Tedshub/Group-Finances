<?php
// database/migrations/2025_11_12_134949_create_user_relation_table.php

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
        Schema::create('user_relation', function (Blueprint $table) {
            $table->id();

            // Foreign key ke users
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang join relation');

            // Foreign key ke relations
            $table->foreignId('relation_id')
                  ->constrained('relations')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Relation yang diikuti');

            // Field untuk membedakan owner dan member
            $table->boolean('is_owner')
                  ->default(false)
                  ->comment('TRUE jika user adalah pembuat/owner relation');

            // Timestamp kapan user join
            $table->timestamp('join_at')
                  ->useCurrent()
                  ->comment('Waktu user join relation');

            $table->timestamps();

            // Unique constraint: user tidak bisa join relation yang sama dua kali
            $table->unique(['user_id', 'relation_id'], 'user_relation_unique');

            // Index tambahan untuk performa query
            $table->index('user_id');
            $table->index('relation_id');
            $table->index('is_owner');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_relation');
    }
};
