<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Tedy Firmansyah',
                'email' => 'tedy@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'role' => 'admin', // Admin
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Potat',
                'email' => 'potat@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'role' => 'guest',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sari',
                'email' => 'sari@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'role' => 'guest',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'role' => 'guest',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rina Wijaya',
                'email' => 'rina@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'role' => 'guest',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}
