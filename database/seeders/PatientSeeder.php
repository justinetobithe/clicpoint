<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('patients')->insert([
            [
                'user_id' => 2,
                'birthdate' => '1990-05-15',
                'gender' => 'Male',
                'address' => '456 Elm St, Town',
                'phone_number' => '+1 (234) 567-8901',
                'emergency_contact_name' => 'Jane Doe',
                'emergency_contact_number' => '+1 (987) 654-3210',
                'medical_history' => 'No significant medical history.',
                'profile_picture' => 'patient_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 6,
                'birthdate' => '1985-09-20',
                'gender' => 'Female',
                'address' => '789 Oak St, City',
                'phone_number' => '+1 (345) 678-9012',
                'emergency_contact_name' => 'John Smith',
                'emergency_contact_number' => '+1 (876) 543-2109',
                'medical_history' => 'Allergies to penicillin.',
                'profile_picture' => 'patient_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 9,
                'birthdate' => '1978-03-12',
                'gender' => 'Female',
                'address' => '123 Maple St, Town',
                'phone_number' => '+1 (567) 890-1234',
                'emergency_contact_name' => 'Maria Rodriguez',
                'emergency_contact_number' => '+1 (234) 567-8901',
                'medical_history' => 'Previous knee surgery.',
                'profile_picture' => 'patient_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 10,
                'birthdate' => '1985-09-20',
                'gender' => 'Female',
                'address' => '789 Oak St, City',
                'phone_number' => '+1 (345) 678-9012',
                'emergency_contact_name' => 'John Smith',
                'emergency_contact_number' => '+1 (876) 543-2109',
                'medical_history' => 'Allergies to penicillin.',
                'profile_picture' => 'patient_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 13,
                'birthdate' => '1985-09-20',
                'gender' => 'Female',
                'address' => '789 Oak St, City',
                'phone_number' => '+1 (345) 678-9012',
                'emergency_contact_name' => 'John Smith',
                'emergency_contact_number' => '+1 (876) 543-2109',
                'medical_history' => 'Allergies to penicillin.',
                'profile_picture' => 'patient_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 16,
                'birthdate' => '1985-09-20',
                'gender' => 'Female',
                'address' => '789 Oak St, City',
                'phone_number' => '+1 (345) 678-9012',
                'emergency_contact_name' => 'John Smith',
                'emergency_contact_number' => '+1 (876) 543-2109',
                'medical_history' => 'Allergies to penicillin.',
                'profile_picture' => 'patient_profile.jpg',
                'status' => 2,
            ],
            [
                'user_id' => 17,
                'birthdate' => '1985-09-20',
                'gender' => 'Female',
                'address' => '789 Oak St, City',
                'phone_number' => '+1 (345) 678-9012',
                'emergency_contact_name' => 'John Smith',
                'emergency_contact_number' => '+1 (876) 543-2109',
                'medical_history' => 'Allergies to penicillin.',
                'profile_picture' => 'patient_profile.jpg',
                'status' => 2,
            ]
        ]);
    }
}
