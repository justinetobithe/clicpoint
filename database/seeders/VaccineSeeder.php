<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VaccineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('vaccines')->insert([
            [
                'vaccine' => 'BCG Vaccine',
                'description' => ' for tuberculosis',
                'added_by' => 1,
                'status' => 1,
            ],
            [
                'vaccine' => 'Hepatitis B Vaccine',
                'description' => '',
                'added_by' => 1,
                'status' => 1,
            ],
            [
                'vaccine' => 'Pentavalent Vaccine',
                'description' => 'for diptheria, pertussis, tetanus, influenza B and hepatitis B',
                'added_by' => 1,
                'status' => 1,
            ],
            [
                'vaccine' => 'Oral Polio Vaccine',
                'description' => '',
                'added_by' => 1,
                'status' => 1,
            ],
            [
                'vaccine' => 'Inactivated Polio Vaccine',
                'description' => '',
                'added_by' => 1,
                'status' => 1,
            ],
            [
                'vaccine' => 'PCV',
                'description' => 'for pneumonia and meningitis',
                'added_by' => 1,
                'status' => 1,
            ],

            [
                'vaccine' => 'MMR Vaccine',
                'description' => 'for measles, mumps and rubella',
                'added_by' => 1,
                'status' => 1,
            ]
        ]);
    }
}
