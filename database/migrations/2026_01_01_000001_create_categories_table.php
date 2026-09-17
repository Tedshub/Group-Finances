<?php
// database/migrations/2026_01_01_000001_create_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            // null = kategori global (default), ada = custom milik grup
            $table->foreignId('relation_id')
                  ->nullable()
                  ->constrained('relations')
                  ->onUpdate('cascade')
                  ->onDelete('cascade')
                  ->comment('Jika null = kategori global, jika ada = custom kategori grup');

            $table->string('name', 100)->comment('Nama kategori');
            $table->string('icon', 50)->default('tag')->comment('Nama ikon (heroicons)');
            $table->string('color', 20)->default('#6B7280')->comment('Warna hex badge');

            // Jenis: bisa dipakai untuk pemasukan, pengeluaran, atau keduanya
            $table->enum('type', ['pemasukan', 'pengeluaran', 'keduanya'])
                  ->default('keduanya')
                  ->comment('Jenis transaksi yang bisa menggunakan kategori ini');

            $table->boolean('is_active')->default(true)->comment('Apakah kategori aktif');
            $table->timestamps();

            $table->index('relation_id');
            $table->index('type');
            $table->index('is_active');
        });

        // Seed kategori default global
        $defaults = [
            ['name' => 'Makan & Minum',      'icon' => 'cake',         'color' => '#F59E0B', 'type' => 'pengeluaran'],
            ['name' => 'Transportasi',        'icon' => 'truck',        'color' => '#3B82F6', 'type' => 'pengeluaran'],
            ['name' => 'Tagihan & Utilitas',  'icon' => 'bolt',         'color' => '#8B5CF6', 'type' => 'pengeluaran'],
            ['name' => 'Belanja',             'icon' => 'shopping-bag', 'color' => '#EC4899', 'type' => 'pengeluaran'],
            ['name' => 'Hiburan',             'icon' => 'musical-note', 'color' => '#06B6D4', 'type' => 'pengeluaran'],
            ['name' => 'Kesehatan',           'icon' => 'heart',        'color' => '#EF4444', 'type' => 'pengeluaran'],
            ['name' => 'Pendidikan',          'icon' => 'academic-cap', 'color' => '#10B981', 'type' => 'pengeluaran'],
            ['name' => 'Lainnya',             'icon' => 'ellipsis-h',   'color' => '#6B7280', 'type' => 'pengeluaran'],
            ['name' => 'Gaji & Upah',         'icon' => 'banknotes',    'color' => '#22C55E', 'type' => 'pemasukan'],
            ['name' => 'Iuran Anggota',       'icon' => 'users',        'color' => '#0EA5E9', 'type' => 'pemasukan'],
            ['name' => 'Donasi / Sumbangan',  'icon' => 'gift',         'color' => '#F472B6', 'type' => 'pemasukan'],
            ['name' => 'Pendapatan Lainnya',  'icon' => 'plus-circle',  'color' => '#84CC16', 'type' => 'pemasukan'],
        ];

        foreach ($defaults as $cat) {
            DB::table('categories')->insert(array_merge($cat, [
                'relation_id' => null,
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
