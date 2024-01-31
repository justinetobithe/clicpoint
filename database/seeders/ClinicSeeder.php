<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClinicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('clinics')->insert([
            'clinic_name' => 'Peguit Pediatric Clinic',
            'doctor_name' => 'Rachel T. Peguit, MD',
            'specialization' => 'Pediatrician',
            'contact_number' => '09705849902',
            'address' => 'Brgy, Mabua, Tandag, Surigao del Sur',
            'clinic_schedule' => 'Monday - Saturday',
            'clinic_time' => '9:00am-12nn / 2:00pm-3:00pm',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
