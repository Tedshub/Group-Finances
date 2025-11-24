<?php
// database/migrations/2025_11_15_000001_create_relation_join_requests_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relation_join_requests', function (Blueprint $table) {
            $table->id();

            // Foreign key ke users (yang request join)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang request join');

            // Foreign key ke relations
            $table->foreignId('relation_id')
                  ->constrained('relations')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Relation yang di-request');

            // Status request
            $table->enum('status', ['pending', 'approved', 'rejected'])
                  ->default('pending')
                  ->comment('Status join request');

            // Pesan dari user (opsional)
            $table->text('message')->nullable()->comment('Pesan dari user');

            // User yang approve/reject (owner)
            $table->foreignId('reviewed_by')
                  ->nullable()
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('set null')
                  ->comment('Owner yang review request');

            // Waktu review
            $table->timestamp('reviewed_at')->nullable()->comment('Waktu request di-review');

            $table->timestamps();

            // Unique constraint: user tidak bisa request relation yang sama lebih dari sekali
            $table->unique(['user_id', 'relation_id'], 'user_relation_request_unique');

            // Index untuk performa
            $table->index('status');
            $table->index(['relation_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relation_join_requests');
    }
};
