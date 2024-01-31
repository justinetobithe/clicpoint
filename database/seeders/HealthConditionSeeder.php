<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HealthConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['category' => 'Respiratory Infections', 'name' => 'Common cold', 'condition' => 1],
            ['category' => 'Respiratory Infections', 'name' => 'Bronchiolitis', 'condition' => 2],
            ['category' => 'Respiratory Infections', 'name' => 'Pneumonia', 'condition' => 3],

            ['category' => 'Gastrointestinal Conditions', 'name' => 'Gastroenteritis (stomach flu)', 'condition' => 1],
            ['category' => 'Gastrointestinal Conditions', 'name' => 'Inflammatory bowel disease (Crohn\'s disease, ulcerative colitis)', 'condition' => 2],
            ['category' => 'Gastrointestinal Conditions', 'name' => 'Necrotizing enterocolitis', 'condition' => 3],

            ['category' => 'Genetic Disorders', 'name' => 'Certain genetic syndromes with minimal impact on daily life', 'condition' => 1],
            ['category' => 'Genetic Disorders', 'name' => 'Down syndrome', 'condition' => 2],
            ['category' => 'Genetic Disorders', 'name' => 'Cystic fibrosis', 'condition' => 3],

            ['category' => 'Neurological Disorders', 'name' => 'Attention-deficit/hyperactivity disorder (ADHD)', 'condition' => 1],
            ['category' => 'Neurological Disorders', 'name' => 'Epilepsy', 'condition' => 2],
            ['category' => 'Neurological Disorders', 'name' => 'Cerebral palsy', 'condition' => 3],

            ['category' => 'Endocrine Disorders', 'name' => 'Hypothyroidism', 'condition' => 1],
            ['category' => 'Endocrine Disorders', 'name' => 'Type 1 diabetes', 'condition' => 2],
            ['category' => 'Endocrine Disorders', 'name' => 'Congenital adrenal hyperplasia', 'condition' => 3],

            ['category' => 'Hematologic Disorders', 'name' => 'Anemia', 'condition' => 1],
            ['category' => 'Hematologic Disorders', 'name' => 'Hemophilia', 'condition' => 2],
            ['category' => 'Hematologic Disorders', 'name' => 'Leukemia', 'condition' => 3],

            ['category' => 'Cardiovascular Conditions', 'name' => 'Innocent heart murmurs', 'condition' => 1],
            ['category' => 'Cardiovascular Conditions', 'name' => 'Congenital heart defects', 'condition' => 2],
            ['category' => 'Cardiovascular Conditions', 'name' => 'Kawasaki disease', 'condition' => 3],

            ['category' => 'Infectious Diseases', 'name' => 'Hand, foot, and mouth disease', 'condition' => 1],
            ['category' => 'Infectious Diseases', 'name' => 'Measles', 'condition' => 2],
            ['category' => 'Infectious Diseases', 'name' => 'Meningitis', 'condition' => 3],

            ['category' => 'Autoimmune Disorders', 'name' => 'Juvenile idiopathic arthritis', 'condition' => 1],
            ['category' => 'Autoimmune Disorders', 'name' => 'Systemic lupus erythematosus', 'condition' => 2],
            ['category' => 'Autoimmune Disorders', 'name' => 'Pediatric autoimmune neuropsychiatric disorders associated with streptococcal infections (PANDAS)', 'condition' => 3],

            ['category' => 'Mental Health Conditions', 'name' => 'Adjustment disorders', 'condition' => 1],
            ['category' => 'Mental Health Conditions', 'name' => 'Anxiety disorders', 'condition' => 2],
            ['category' => 'Mental Health Conditions', 'name' => 'Childhood-onset schizophrenia', 'condition' => 3],
        ];

        DB::table('health_conditions')->insert($data);
    }
}
