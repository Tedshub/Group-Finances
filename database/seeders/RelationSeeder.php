<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RelationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada user dulu (akan dibuat di UserSeeder)
        // Seeder ini akan dijalankan SETELAH UserSeeder di DatabaseSeeder

        $relations = [
            [
                'kode' => 'STUDY2025',
                'nama' => 'Study Group Laravel',
                'deskripsi' => 'Grup belajar Laravel untuk pemula dan menengah',
                'creator_id' => 2, // Tedy
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'PROJECT01',
                'nama' => 'Project Team Alpha',
                'deskripsi' => 'Tim project development aplikasi e-commerce',
                'creator_id' => 3, // Tedy
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'WORKOUT2025',
                'nama' => 'Fitness Buddies',
                'deskripsi' => 'Komunitas olahraga dan hidup sehat',
                'creator_id' => 4, // Potat
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'COOK123',
                'nama' => 'Cooking Club',
                'deskripsi' => 'Berbagi resep dan tips masak',
                'creator_id' => 2, // Sari
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kode' => 'GAME2025',
                'nama' => 'Gaming Squad',
                'deskripsi' => 'Main game bareng dan turnamen',
                'creator_id' => 3, // Potat
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('relations')->insert($relations);
    }
}
