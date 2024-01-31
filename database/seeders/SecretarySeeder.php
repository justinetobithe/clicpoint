<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SecretarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('secretaries')->insert([
            [
                'user_id' => 3,
                'office_location' => 'Medical Center, Room 101',
                'phone_number' => '+1 (123) 456-7890',
                'responsibilities' => 'Managing appointments, patient records, and front desk operations.',
                'profile_picture' => 'secretary_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 7,
                'office_location' => 'Medical Center, Room 202',
                'phone_number' => '+1 (345) 678-9012',
                'responsibilities' => 'Handling administrative tasks and patient inquiries.',
                'profile_picture' => 'secretary_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 11,
                'office_location' => 'Medical Center, Room 203',
                'phone_number' => '+1 (456) 789-0123',
                'responsibilities' => 'Scheduling appointments and managing patient records.',
                'profile_picture' => 'secretary_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 14,
                'office_location' => 'Medical Center, Room 204',
                'phone_number' => '+1 (567) 890-1234',
                'responsibilities' => 'Assisting with administrative tasks and patient support.',
                'profile_picture' => 'secretary_profile.jpg',
                'status' => 2,
            ]

        ]);
    }
}
