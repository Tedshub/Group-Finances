<?php
// database/migrations/2026_01_01_000002_add_category_to_transactions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('category_id')
                  ->nullable()
                  ->after('jenis')
                  ->constrained('categories')
                  ->onUpdate('cascade')
                  ->onDelete('set null')
                  ->comment('Kategori transaksi');

            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
