<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function children()
    {
        return $this->belongsTo(Child::class, 'child_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function prescription_medications()
    {
        return $this->hasMany(PrescriptionMedication::class);
    }
}
