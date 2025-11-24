<?php
// database/migrations/2025_11_16_000001_create_transactions_table.php

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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            // Foreign key ke relations
            $table->foreignId('relation_id')
                  ->constrained('relations')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Relation tempat transaksi ini');

            // Foreign key ke users (pembuat transaksi)
            $table->unsignedBigInteger('user_id')
                  ->nullable()
                  ->comment('User yang membuat transaksi');

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onUpdate('cascade')
                  ->onDelete('set null');

            // Menyimpan nama user untuk history
            $table->string('user_name', 100)
                  ->comment('Nama user saat membuat transaksi (untuk history)');

            // Jenis transaksi
            $table->enum('jenis', ['pemasukan', 'pengeluaran'])
                  ->comment('Jenis transaksi');

            // Jumlah transaksi
            $table->decimal('jumlah', 15, 2)
                  ->comment('Jumlah uang transaksi');

            // Catatan
            $table->text('catatan')
                  ->nullable()
                  ->comment('Catatan/deskripsi transaksi');

            // Bukti transaksi (path file) - disimpan di private storage
            $table->string('bukti', 255)
                  ->nullable()
                  ->comment('Path file bukti transaksi di private storage');

            // Waktu transaksi (menggunakan timezone sistem)
            $table->timestamp('waktu_transaksi')
                  ->useCurrent()
                  ->comment('Waktu transaksi dilakukan');

            $table->timestamps();

            // REMOVED: $table->softDeletes(); - Tidak menggunakan soft delete

            // Index untuk performa query
            $table->index('relation_id');
            $table->index('user_id');
            $table->index('jenis');
            $table->index('waktu_transaksi');
            $table->index(['relation_id', 'jenis']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
