<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'Clicpoint Admin',
                'email' => 'admin@clicpoint.com',
                'password' => Hash::make('asdasdasd'),
                'role' => 4, // Admin role
                'status' => 2, // Active
                'birthdate' => '1990-05-15',
                'gender' => 'Male',
                'address' => '123 Main St, City',
                'phone_number' => '555-1234',
                'profile_picture' => '',
                'verified' => 1
            ],
            [
                'name' => 'Rodolfo Manlangit',
                'email' => 'rodolfomanlangit@clicpoint.com',
                'password' => Hash::make('asdasdasd'),
                'role' => 1, // Parent role
                'status' => 2,
                'birthdate' => '1985-10-22',
                'gender' => 'Male',
                'address' => '456 Oak St, Town',
                'phone_number' => '555-5678',
                'profile_picture' => '',
                'verified' => 1
            ],
            [
                'name' => 'Ericka Jean Ventura',
                'email' => 'secretary@clicpoint.com',
                'password' => Hash::make('asdasdasd'),
                'role' => 2, // Secretary role
                'status' => 2,
                'birthdate' => '1992-03-08',
                'gender' => 'Female',
                'address' => '789 Pine St, Village',
                'phone_number' => '555-9012',
                'profile_picture' => '',
                'verified' => 1
            ],
            [
                'name' => 'Rachel T. Peguit',
                'email' => 'rachelpeguit@clicpoint.com',
                'password' => Hash::make('asdasdasd'),
                'role' => 3, // Doctor role
                'status' => 2,
                'birthdate' => '1978-07-17',
                'gender' => 'Male',
                'address' => '101 Willow St, Hamlet',
                'phone_number' => '555-3456',
                'profile_picture' => '',
                'verified' => 1
            ],
        ]);
    }
}
