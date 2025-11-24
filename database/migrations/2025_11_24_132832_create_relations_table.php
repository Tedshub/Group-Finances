<?php
// database/migrations/2025_11_12_134949_relation.php
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
        Schema::create('relations', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 20)->unique()->comment('Kode unik untuk join relation');
            $table->string('nama', 100)->comment('Nama relation/grup');
            $table->text('deskripsi')->nullable()->comment('Deskripsi relation');

            // Foreign key ke users (creator)
            $table->foreignId('creator_id')
                  ->constrained('users')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('User yang membuat relation ini');

            $table->timestamps();

            // Index untuk performa
            $table->index('kode');
            $table->index('creator_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relations');
    }
};
