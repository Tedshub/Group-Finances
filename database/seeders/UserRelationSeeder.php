<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserRelationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil ID dari database
        $users = DB::table('users')->pluck('id', 'email');
        $relations = DB::table('relations')->pluck('id', 'kode');

        $userRelations = [
            // === Study Group Laravel (STUDY2025) ===
            // Tedy sebagai owner
            [
                'user_id' => $users['tedy@gmail.com'],
                'relation_id' => $relations['STUDY2025'],
                'is_owner' => true,
                'join_at' => Carbon::now()->subDays(10),
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
            // Potat join sebagai member
            [
                'user_id' => $users['potat@gmail.com'],
                'relation_id' => $relations['STUDY2025'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(8),
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(8),
            ],
            // Sari join sebagai member
            [
                'user_id' => $users['sari@gmail.com'],
                'relation_id' => $relations['STUDY2025'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(7),
                'created_at' => Carbon::now()->subDays(7),
                'updated_at' => Carbon::now()->subDays(7),
            ],
            // Budi join sebagai member
            [
                'user_id' => $users['budi@gmail.com'],
                'relation_id' => $relations['STUDY2025'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],

            // === Project Team Alpha (PROJECT01) ===
            // Tedy sebagai owner
            [
                'user_id' => $users['tedy@gmail.com'],
                'relation_id' => $relations['PROJECT01'],
                'is_owner' => true,
                'join_at' => Carbon::now()->subDays(15),
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
            // Budi join sebagai member
            [
                'user_id' => $users['budi@gmail.com'],
                'relation_id' => $relations['PROJECT01'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(12),
                'created_at' => Carbon::now()->subDays(12),
                'updated_at' => Carbon::now()->subDays(12),
            ],
            // Rina join sebagai member
            [
                'user_id' => $users['rina@gmail.com'],
                'relation_id' => $relations['PROJECT01'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(10),
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],

            // === Fitness Buddies (WORKOUT2025) ===
            // Potat sebagai owner
            [
                'user_id' => $users['potat@gmail.com'],
                'relation_id' => $relations['WORKOUT2025'],
                'is_owner' => true,
                'join_at' => Carbon::now()->subDays(20),
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(20),
            ],
            // Sari join sebagai member
            [
                'user_id' => $users['sari@gmail.com'],
                'relation_id' => $relations['WORKOUT2025'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(18),
                'created_at' => Carbon::now()->subDays(18),
                'updated_at' => Carbon::now()->subDays(18),
            ],
            // Rina join sebagai member
            [
                'user_id' => $users['rina@gmail.com'],
                'relation_id' => $relations['WORKOUT2025'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(15),
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],

            // === Cooking Club (COOK123) ===
            // Sari sebagai owner
            [
                'user_id' => $users['sari@gmail.com'],
                'relation_id' => $relations['COOK123'],
                'is_owner' => true,
                'join_at' => Carbon::now()->subDays(25),
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(25),
            ],
            // Tedy join sebagai member
            [
                'user_id' => $users['tedy@gmail.com'],
                'relation_id' => $relations['COOK123'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(20),
                'created_at' => Carbon::now()->subDays(20),
                'updated_at' => Carbon::now()->subDays(20),
            ],
            // Rina join sebagai member
            [
                'user_id' => $users['rina@gmail.com'],
                'relation_id' => $relations['COOK123'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(18),
                'created_at' => Carbon::now()->subDays(18),
                'updated_at' => Carbon::now()->subDays(18),
            ],

            // === Gaming Squad (GAME2025) ===
            // Potat sebagai owner
            [
                'user_id' => $users['potat@gmail.com'],
                'relation_id' => $relations['GAME2025'],
                'is_owner' => true,
                'join_at' => Carbon::now()->subDays(30),
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(30),
            ],
            // Budi join sebagai member
            [
                'user_id' => $users['budi@gmail.com'],
                'relation_id' => $relations['GAME2025'],
                'is_owner' => false,
                'join_at' => Carbon::now()->subDays(25),
                'created_at' => Carbon::now()->subDays(25),
                'updated_at' => Carbon::now()->subDays(25),
            ],
        ];

        DB::table('user_relation')->insert($userRelations);
    }
}
