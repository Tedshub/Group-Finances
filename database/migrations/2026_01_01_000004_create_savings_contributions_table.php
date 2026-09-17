<?php
// database/migrations/2026_01_01_000004_create_savings_contributions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('savings_contributions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('savings_goal_id')
                  ->constrained('savings_goals')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Target tabungan yang disetor');

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang menyetor');

            // Simpan nama untuk history jika user dihapus
            $table->string('user_name', 100)->comment('Nama user saat menyetor (untuk history)');

            $table->decimal('amount', 15, 2)->comment('Jumlah setoran (Rp)');
            $table->text('note')->nullable()->comment('Catatan setoran');
            $table->date('date')->comment('Tanggal setoran');

            $table->timestamps();

            $table->index('savings_goal_id');
            $table->index('user_id');
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('savings_contributions');
    }
};
