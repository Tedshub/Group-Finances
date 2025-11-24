<?php
// database/migrations/2025_11_12_134949_create_user_relation_table.php
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
        Schema::create('user_relation', function (Blueprint $table) {
            $table->id();

            // Foreign key ke users
            $table->unsignedBigInteger('user_id')
                  ->comment('User yang join relation');

            // Foreign key ke relations
            $table->unsignedBigInteger('relation_id')
                  ->comment('Relation yang diikuti');

            // Field untuk membedakan owner dan member
            $table->boolean('is_owner')
                  ->default(false)
                  ->index()  // Tambahkan index langsung di sini
                  ->comment('TRUE jika user adalah pembuat/owner relation');

            // Timestamp kapan user join
            $table->timestamp('join_at')
                  ->nullable()  // Ubah jadi nullable untuk fleksibilitas
                  ->comment('Waktu user join relation');

            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');

            $table->foreign('relation_id')
                  ->references('id')
                  ->on('relations')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');

            // Unique constraint: user tidak bisa join relation yang sama dua kali
            $table->unique(['user_id', 'relation_id'], 'user_relation_unique');

            // Index untuk performa query
            $table->index(['user_id', 'is_owner'], 'user_owner_index');
            $table->index(['relation_id', 'is_owner'], 'relation_owner_index');
            $table->index('join_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_relation');
    }
};
