<?php
// database/migrations/2026_01_01_000005_create_budgets_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('relation_id')
                  ->constrained('relations')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Relation/grup pemilik anggaran');

            $table->foreignId('category_id')
                  ->constrained('categories')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Kategori yang dianggarkan');

            $table->foreignId('created_by')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang membuat anggaran');

            $table->decimal('amount', 15, 2)->comment('Plafon/batas maksimal pengeluaran (Rp)');

            $table->tinyInteger('month')->comment('Bulan (1-12)');
            $table->smallInteger('year')->comment('Tahun (YYYY)');

            $table->timestamps();

            // Unique: satu kategori hanya boleh punya 1 budget per bulan per relation
            $table->unique(['relation_id', 'category_id', 'month', 'year'], 'budget_period_unique');

            $table->index('relation_id');
            $table->index(['relation_id', 'month', 'year']);
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
