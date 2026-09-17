<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  // penerima
            $table->foreignId('actor_id')->nullable()->constrained('users')->onDelete('set null'); // pelaku aksi
            $table->foreignId('relation_id')->nullable()->constrained('relations')->onDelete('cascade'); // grup terkait
            $table->string('type');          // transaction | savings_goal | join_request | join_approved | join_rejected
            $table->string('title');
            $table->text('body');
            $table->string('url')->nullable(); // URL tujuan saat diklik
            $table->timestamp('read_at')->nullable(); // null = belum dibaca
            $table->timestamps();

            $table->index(['user_id', 'read_at']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
