<?php
// database/migrations/2025_11_29_000002_create_message_reads_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_reads', function (Blueprint $table) {
            $table->id();

            // Foreign key ke messages
            $table->foreignId('message_id')
                  ->constrained('messages')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Pesan yang dibaca');

            // Foreign key ke users (pembaca)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang membaca pesan');

            // Waktu dibaca
            $table->timestamp('read_at')
                  ->useCurrent()
                  ->comment('Waktu pesan dibaca');

            // Unique constraint: user tidak bisa "baca" pesan yang sama 2x
            $table->unique(['message_id', 'user_id'], 'message_user_read_unique');

            // Index untuk query cepat
            $table->index(['user_id', 'read_at'], 'user_read_time_index');
            $table->index('message_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_reads');
    }
};
