<?php
// database/migrations/2025_11_29_000003_create_message_reactions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_reactions', function (Blueprint $table) {
            $table->id();

            // Foreign key ke messages
            $table->foreignId('message_id')
                  ->constrained('messages')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Pesan yang direact');

            // Foreign key ke users
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang kasih reaction');

            // Emoji reaction
            $table->string('emoji', 10)
                  ->comment('Emoji reaction (😀, 👍, ❤️, dll)');

            $table->timestamps();

            // Unique: user cuma bisa react 1x per pesan dengan emoji yang sama
            $table->unique(['message_id', 'user_id', 'emoji'], 'message_user_emoji_unique');

            // Index
            $table->index(['message_id', 'emoji'], 'message_emoji_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_reactions');
    }
};
