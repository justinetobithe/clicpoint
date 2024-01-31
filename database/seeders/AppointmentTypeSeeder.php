<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AppointmentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();
        DB::table('appointment_types')->insert([
            [
                'name' => 'Consultation',
                'description' => 'This is a general appointment where a patient seeks medical advice, diagnosis, or treatment recommendations from a healthcare provider.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Follow-up Check-up',
                'description' => 'This appointment type is scheduled for a patient to have a follow-up medical examination, assessment, or evaluation after a previous medical visit or treatment.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Vaccination/Immunization',
                'description' => 'Appointments for administering vaccines to prevent various diseases are scheduled as part of routine healthcare.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
