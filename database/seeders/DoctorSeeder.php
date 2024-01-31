<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('doctors')->insert([
            [
                'user_id' => 4,
                'specialization' => 'Pediatrician',
                'license_number' => 'MD12345',
                'ptr_number' => '123456789',
                'clinic_address' => '123 Main St, City',
                'bio' => 'Experienced cardiologist with a focus on heart health.',
                'consultation_fee' => 500.00,
                'availability' => 'Monday to Friday, 9:00 AM - 5:00 PM',
            ],
        ]);
    }
}
