<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('child_id');
            $table->unsignedBigInteger('appointment_type_id');
            $table->unsignedBigInteger('health_condition_id')->nullable();
            $table->integer('user_id')->nullable();
            $table->text('reason');
            $table->date('schedule');
            $table->string('time');
            $table->tinyInteger('remarks')->comment('1 = Cancel, 2 = Catered, 3 = Not Attended')->nullable();
            $table->text('remarks_description')->nullable(); 
            $table->tinyInteger('status')->comment('1 = Pending, 2 = Approved, 3 = Rejected')->default(1);
            $table->text('status_description')->nullable();
            $table->timestamps();

            $table->foreign('child_id')->references('id')->on('children')->onDelete('cascade');
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
        Schema::dropIfExists('appointments');
    }
}
