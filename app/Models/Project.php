<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $guarded = ['id'];



    public function immunization()
    {
        return $this->hasMany(Immunization::class, 'project_id');
    }
}
