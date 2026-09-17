<?php
// database/migrations/2025_11_29_000001_create_messages_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            // Foreign key ke relations (grup chat)
            $table->foreignId('relation_id')
                  ->constrained('relations')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Relation/grup tempat pesan dikirim');

            // Foreign key ke users (pengirim)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang mengirim pesan');

            // Konten pesan
            $table->text('message')
                  ->comment('Isi pesan chat');

            // Type pesan: text, image, file, system
            $table->enum('type', ['text', 'image', 'file', 'system'])
                  ->default('text')
                  ->comment('Jenis pesan');

            // Path file jika ada attachment
            $table->string('file_path', 500)
                  ->nullable()
                  ->comment('Path file/image jika ada');

            // Nama file asli
            $table->string('file_name', 255)
                  ->nullable()
                  ->comment('Nama file asli');

            // Ukuran file (bytes)
            $table->unsignedInteger('file_size')
                  ->nullable()
                  ->comment('Ukuran file dalam bytes');

            // ID pesan yang direply (untuk fitur reply)
            $table->foreignId('reply_to_message_id')
                  ->nullable()
                  ->constrained('messages')
                  ->onUpdate('cascade')
                  ->onDelete('set null')
                  ->comment('ID pesan yang direply');

            // Soft delete untuk "pesan dihapus"
            $table->softDeletes();

            $table->timestamps();

            // Index untuk performa query
            $table->index(['relation_id', 'created_at'], 'relation_time_index');
            $table->index(['user_id', 'created_at'], 'user_time_index');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
