<?php
// database/migrations/2026_01_01_000006_add_settings_to_relations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('relations', function (Blueprint $table) {
            // Preferensi & hak akses grup
            $table->json('settings')->nullable()->after('deskripsi')
                  ->comment('Pengaturan JSON grup: member_can_add_category, dll');
        });

        Schema::table('user_relation', function (Blueprint $table) {
            // Preferensi notifikasi per anggota
            $table->json('notification_prefs')->nullable()->after('join_at')
                  ->comment('Preferensi notifikasi JSON per anggota');
        });
    }

    public function down(): void
    {
        Schema::table('relations', function (Blueprint $table) {
            $table->dropColumn('settings');
        });

        Schema::table('user_relation', function (Blueprint $table) {
            $table->dropColumn('notification_prefs');
        });
    }
};
