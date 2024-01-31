<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call([
            VaccineSeeder::class,
            UserSeeder::class,
            AppointmentTypeSeeder::class,
            HealthConditionSeeder::class,
            DoctorSeeder::class,
            // PatientSeeder::class,
            // SecretarySeeder::class,
            ClinicSeeder::class
        ]);
    }
}
