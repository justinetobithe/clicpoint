<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Outpatient extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent',
        'child',
        'address',
        'date_of_birth',
        'gender',
        'relationship',
        'phone_number',
    ];
}
