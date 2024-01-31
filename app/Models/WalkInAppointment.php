<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalkInAppointment extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function appointmentType()
    {
        return $this->belongsTo(AppointmentType::class, 'appointment_type_id');
    }

    public function healthCondition()
    {
        return $this->belongsTo(HealthCondition::class, 'health_condition_id');
    }
}
