<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $guarded = ['id'];


    // public function program()
    // {
    //     return $this->belongsTo(Program::class,);
    // }

    public function projects()
    {
        return $this->hasMany(Project::class, 'program_id');
    }


    public function immunization()
    {
        return $this->belongsToMany(Project::class, Immunization::class);
    }
}
