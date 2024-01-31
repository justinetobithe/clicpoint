<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWalkInAppointmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('walk_in_appointments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('appointment_type_id');
            $table->unsignedBigInteger('health_condition_id')->nullable();
            $table->text('parent');
            $table->text('child');
            $table->text('reason');
            $table->date('schedule')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->tinyInteger('status')->comment('1 = Cancel, 2 = Done')->nullable();
            $table->timestamps();

            $table->foreign('appointment_type_id')->references('id')->on('appointment_types')->onDelete('cascade');
            $table->foreign('health_condition_id')->references('id')->on('health_conditions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('walk_in_appointments');
    }
}
