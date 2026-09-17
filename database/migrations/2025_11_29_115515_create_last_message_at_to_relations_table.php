<?php
// database/migrations/2025_12_01_000004_add_last_message_at_to_relations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambahkan kolom last_message_at yang nullable ke tabel relations
        Schema::table('relations', function (Blueprint $table) {
            $table->timestamp('last_message_at')->nullable()->after('deskripsi')->comment('Timestamp dari pesan terakhir dalam grup');
        });

        // 2. Tambahkan indeks untuk kolom last_message_at agar query sorting lebih cepat
        Schema::table('relations', function (Blueprint $table) {
            $table->index('last_message_at', 'relations_last_message_at_index');
        });

        // 3. Isi kolom last_message_at untuk data yang sudah ada
        // Query ini akan mengupdate setiap baris di tabel 'relations' dengan waktu pembuatan
        // pesan terkait yang terbaru.
        DB::statement(
            "UPDATE relations r
            SET last_message_at = (
                SELECT MAX(m.created_at)
                FROM messages m
                WHERE m.relation_id = r.id
            )"
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('relations', function (Blueprint $table) {
            // Hapus indeks terlebih dahulu sebelum menghapus kolom
            $table->dropIndex('relations_last_message_at_index');
            // Hapus kolom
            $table->dropColumn('last_message_at');
        });
    }
};
