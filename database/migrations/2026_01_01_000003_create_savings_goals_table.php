<?php
// database/migrations/2026_01_01_000003_create_savings_goals_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('savings_goals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('relation_id')
                  ->constrained('relations')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Relation/grup pemilik tabungan');

            $table->foreignId('created_by')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang membuat target tabungan');

            $table->string('title', 150)->comment('Nama / judul target tabungan');
            $table->text('description')->nullable()->comment('Deskripsi singkat target');

            $table->decimal('target_amount', 15, 2)->comment('Target dana yang ingin dikumpulkan (Rp)');
            $table->decimal('current_amount', 15, 2)->default(0)->comment('Total dana yang sudah terkumpul (Rp)');

            $table->date('deadline')->nullable()->comment('Tanggal target/deadline');

            $table->string('icon', 50)->default('piggy-bank')->comment('Ikon target tabungan');
            $table->string('color', 20)->default('#10B981')->comment('Warna badge hex');

            $table->enum('scope', ['group', 'personal'])->default('group')
                  ->comment('group = tabungan bersama, personal = tabungan pribadi');

            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active')
                  ->comment('Status target tabungan');

            $table->timestamp('completed_at')->nullable()->comment('Waktu target selesai/tercapai');

            $table->timestamps();

            $table->index('relation_id');
            $table->index('created_by');
            $table->index('status');
            $table->index(['relation_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('savings_goals');
    }
};
