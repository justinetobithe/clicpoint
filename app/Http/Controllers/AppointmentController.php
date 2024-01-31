<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $appointments = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])
            ->orderBy('id', 'desc')
            ->get();

        return $appointments;
    }

    public function getTodayAppointments()
    {
        $today = Carbon::now()->toDateString();

        $appointments = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])
            ->whereDate('schedule', $today)
            ->orderBy('schedule', 'asc')
            ->count();

        return $appointments;
    }

    public function getAppointmentRequests()
    {
        $appointmentRequests = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->count();

        return $appointmentRequests;
    }

    public function getTotalAppointments()
    {
        $totalAppointments = Appointment::count();

        return $totalAppointments;
    }

    public function countAppointmentsByMonth()
    {
        $currentYear = date('Y');

        $months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        $counts = DB::table('appointments')
            ->select(DB::raw('MONTH(schedule) as month'), DB::raw('COUNT(*) as count'))
            ->whereYear('schedule', $currentYear)
            ->where('status', 2)
            ->groupBy(DB::raw('MONTH(schedule)'))
            ->get();

        $appointmentCountsByMonth = [];
        foreach ($months as $month) {
            $appointmentCountsByMonth[] = [
                'month' => $month,
                'count' => 0,
            ];
        }

        foreach ($counts as $count) {
            $monthNumber = $count->month;
            $appointmentCountsByMonth[$monthNumber - 1]['count'] = $count->count;
        }

        return $appointmentCountsByMonth;
    }


    public function countHealthConditionsAndImmunizations()
    {
        $counts = [];

        $healthConditions = DB::table('appointments')
            ->join('health_conditions', 'appointments.health_condition_id', '=', 'health_conditions.id')
            ->select('health_conditions.name', DB::raw('COUNT(*) as count'))
            ->groupBy('health_conditions.name')
            ->get();

        $counts['health_conditions'] = $healthConditions;

        $immunizations = DB::table('appointments')
            ->join('appointment_types', 'appointments.appointment_type_id', '=', 'appointment_types.id')
            ->select('appointment_types.name', DB::raw('COUNT(*) as count'))
            ->where('appointment_types.name', 'Vaccination/Immunization')
            ->groupBy('appointment_types.name')
            ->get();

        $counts['immunizations'] = $immunizations;

        $vaccinationSummary = [
            'name' => 'Vaccination/Immunization',
            'count' => $counts['immunizations']->sum('count'),
        ];

        $result = array_merge($counts['health_conditions']->toArray(), [$vaccinationSummary]);

        return $result;
    }


    public function getApprovedAppointments()
    {
        $appointments = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])
            ->where('status', 2)
            ->get();

        return $appointments;
    }


    public function getUserAppointments($parent_id)
    {
        $userAppointments = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition', 'diagnosis', 'prescription.prescription_medications'])
            ->where('user_id', $parent_id)
            ->orderBy('id', 'desc')
            ->get();

        return $userAppointments;
    }

    public function getUserAppointmentsByDate($parent_id)
    {
        $today = now()->format('Y-m-d');

        $userAppointments = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])
            ->where('user_id', $parent_id)
            ->whereDate('schedule', $today)
            ->orderBy('schedule', 'asc')
            ->get();

        return $userAppointments;
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $existingAppointments = Appointment::where('schedule', $request->schedule)
            ->where('time', $request->time)
            ->where('status', 2)
            ->get();

        if ($existingAppointments->count() > 0) {
            $hasApprovedAppointment = $existingAppointments->contains('status', 2);

            if ($hasApprovedAppointment) {
                $response['status'] = false;
                $response['message'] = 'An appointment with the same date and time already exists and is already approved.';
                return $response;
            }
        }

        $data = [
            'child_id' => $request->child_id,
            'appointment_type_id' => $request->appointment_type_id,
            'health_condition_id' => $request->health_condition_id,
            'schedule' => $request->schedule,
            'time' => $request->time,
            'reason' => $request->reason,
            'status' => $request->status,
            'user_id' => $request->user_id,
        ];

        $insert_appointment = Appointment::create($data);

        if ($insert_appointment) {
            $response['status'] = true;
            $response['message'] = "Appointment created successfully";
            $response['payload'] = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])->where('id', $insert_appointment->id)->first();
        } else {
            $response['message'] = "Unauthorized";
        }

        return $response;
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Appointment::with(['user', 'appointmentType', 'healthCondition'])->where('id', $id)->first();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    public function updatePriorityQueue(Request $request)
    {
        $success = 0;
        $data = $request->data;
        $notifications = [];

        foreach ($data as $item) {
            if ($item['data']) {
                $update = Appointment::where('id', $item['data']['id'])->update([
                    'time' => $item['time']
                ]);

                if ($update) {
                    $success += 1;
                    $notifications[] = $item['data']['id'];
                }
            }
        }

        $this->sendSmsNotifications($notifications);

        $response = [
            'status' => $success > 0 ? true : false,
            'message' => $success > 0 ? 'Priority queue updated successfully' : 'No changes were made',
            'payload' => Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])
                ->where('status', 2)
                ->get()
        ];

        return response()->json($response);
    }

    private function sendSmsNotifications(array $appointmentIds)
    {
        $twilioSid = env('TWILIO_SID');
        $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
        $twilioMessageServicingId = env('TWILIO_MESSAGING_SERVICE_ID');

        $client = new Client($twilioSid, $twilioAuthToken);

        foreach ($appointmentIds as $appointmentId) {
            $appointment = Appointment::with(['user', 'appointmentType', 'healthCondition'])
                ->where('id', $appointmentId)
                ->where('status', 2)
                ->first();

            if ($appointment) {
                $phoneNumber = '+63' . substr($appointment->user->phone_number, 1);
                $formattedDate = Carbon::parse($appointment->schedule)->format('F d, Y');

                $message = "Good day, " . $appointment->user->name . "! Your appointment for " . $appointment->appointmentType->name . " on " . $formattedDate . " at " . $appointment->time . " has been approved. Please note that the schedule may have changed due to prioritization in the clinic. Thank you!";

                try {
                    $send_message = $client->messages->create(
                        $phoneNumber,
                        array(
                            'messagingServiceSid' => $twilioMessageServicingId,
                            'body' => $message,
                        )
                    );

                    if ($send_message->sid) {
                        Log::info("SMS notification sent successfully for appointment ID: $appointmentId");
                    } else {
                        Log::error("Failed to send SMS notification for appointment ID: $appointmentId");
                    }
                } catch (\Exception $e) {
                    Log::error("Exception while sending SMS notification for appointment ID: $appointmentId. Exception: " . $e->getMessage());
                }
            }
        }
    }

    public function updateRemarks(Request $request, $id)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $data = [
            'remarks' => $request->remarks,
            'remarks_description' => $request->remarks_description,
        ];

        $update_appointment = Appointment::where('id', $id)->update($data);

        if ($update_appointment) {
            $response['status'] = true;
            $response['message'] = "Remarks updated successfully";
            $response['payload'] = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])->where('id', $id)->first();
        } else {
            $response['message'] = "Unauthorized";
        }

        return $response;
    }


    public function updateStatus(Request $request, $id)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error',
        ];

        $data = [
            'status' => $request->status,
            'status_description' => $request->status_description,
        ];

        if ($request->status == 2) {
            $currentAppointment = Appointment::findOrFail($id);

            $currentAppointment->update($data);

            $existingAppointments = Appointment::where('id', '!=', $id)
                ->where('status', 1)
                ->where('schedule', $currentAppointment->schedule)
                ->where('time', $currentAppointment->time)
                ->get();

            if ($existingAppointments->count() > 0) {
                foreach ($existingAppointments as $existingAppointment) {
                    $existingAppointment->update($data);
                    $this->sendCancelledAppointmentSMS($existingAppointment->id);
                }
            }

            $updatedAppointment = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])->findOrFail($id);

            $this->sendApprovedAppointmentSMS($updatedAppointment->id);

            $response['status'] = true;
            $response['message'] = "Successfully Updated";
            $response['payload'] = $updatedAppointment;
        } elseif ($request->status == 3) {
            $update_appointment = Appointment::where('id', $id)->update($data);

            $this->sendRejectedAppointmentSMS($id);

            if ($update_appointment) {
                $response['status'] = true;
                $response['message'] = "Successfully Updated";
                $response['payload'] = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])->where('id', $id)->first();
            } else {
                $response['message'] = "Unauthorized";
            }
        } else {
            $update_appointment = Appointment::where('id', $id)->update($data);

            $this->sendCancelledAppointmentSMS($update_appointment->id);

            if ($update_appointment) {
                $response['status'] = true;
                $response['message'] = "Successfully Updated";
                $response['payload'] = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])->where('id', $id)->first();
            } else {
                $response['message'] = "Unauthorized";
            }
        }

        return $response;
    }

    private function sendRejectedAppointmentSMS($appointmentId)
    {
        $twilioSid = env('TWILIO_SID');
        $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
        $twilioMessageServicingId = env('TWILIO_MESSAGING_SERVICE_ID');

        $client = new Client($twilioSid, $twilioAuthToken);

        $appointment = Appointment::with(['user', 'appointmentType', 'healthCondition'])
            ->where('id', $appointmentId)
            ->where('status', 3)
            ->first();

        if ($appointment) {
            $phoneNumber = '+63' . substr($appointment->user->phone_number, 1);
            $formattedDate = Carbon::parse($appointment->schedule)->format('F d, Y');
            $formattedTime = $appointment->time;

            $message = "We regret to inform you that the appointment for " . $appointment->appointmentType->name . " on " . $formattedDate . " at " . $formattedTime . " has been rejected. We appreciate your understanding. Feel free to contact us for further assistance.";

            try {
                $send_message = $client->messages->create(
                    $phoneNumber,
                    array(
                        'messagingServiceSid' => $twilioMessageServicingId,
                        'body' => $message,
                    )
                );

                if ($send_message->sid) {
                    Log::info("Rejected Appointment SMS sent successfully for appointment ID: $appointmentId");
                } else {
                    Log::error("Failed to send Rejected Appointment SMS for appointment ID: $appointmentId");
                }
            } catch (\Exception $e) {
                Log::error("Exception while sending Rejected Appointment SMS for appointment ID: $appointmentId. Exception: " . $e->getMessage());
            }
        }
    }


    private function sendCancelledAppointmentSMS($appointmentId)
    {
        $twilioSid = env('TWILIO_SID');
        $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
        $twilioMessageServicingId = env('TWILIO_MESSAGING_SERVICE_ID');

        $client = new Client($twilioSid, $twilioAuthToken);

        $appointment = Appointment::with(['user', 'appointmentType', 'healthCondition'])
            ->where('id', $appointmentId)
            ->where('status', 3)
            ->first();

        if ($appointment) {
            $phoneNumber = '+63' . substr($appointment->user->phone_number, 1);
            $formattedDate = Carbon::parse($appointment->schedule)->format('F d, Y');
            $formattedTime = $appointment->time;

            $message = "We regret to inform you that the appointment for " . $appointment->appointmentType->name . " on " . $formattedDate . " at " . $formattedTime . " has been canceled. This slot is now unavailable. Feel free to book another appointment. We apologize for any inconvenience caused.";

            try {
                $send_message = $client->messages->create(
                    $phoneNumber,
                    array(
                        'messagingServiceSid' => $twilioMessageServicingId,
                        'body' => $message,
                    )
                );

                if ($send_message->sid) {
                    Log::info("Cancelled Appointment SMS sent successfully for appointment ID: $appointmentId");
                } else {
                    Log::error("Failed to send Cancelled Appointment SMS for appointment ID: $appointmentId");
                }
            } catch (\Exception $e) {
                Log::error("Exception while sending Cancelled Appointment SMS for appointment ID: $appointmentId. Exception: " . $e->getMessage());
            }
        }
    }


    private function sendApprovedAppointmentSMS($appointmentId)
    {
        $twilioSid = env('TWILIO_SID');
        $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
        $twilioMessageServicingId = env('TWILIO_MESSAGING_SERVICE_ID');

        $client = new Client($twilioSid, $twilioAuthToken);

        $appointment = Appointment::with(['user', 'appointmentType', 'healthCondition'])
            ->where('id', $appointmentId)
            ->where('status', 2)
            ->first();

        if ($appointment) {
            $phoneNumber = '+63' . substr($appointment->user->phone_number, 1);
            $formattedDate = Carbon::parse($appointment->schedule)->format('F d, Y');

            $message = "Good day, " . $appointment->user->name . "! Your appointment for " . $appointment->appointmentType->name . " on " . $formattedDate . " at " . $appointment->time . " has been approved. Thank you!";

            try {
                $send_message = $client->messages->create(
                    $phoneNumber,
                    array(
                        'messagingServiceSid' => $twilioMessageServicingId,
                        'body' => $message,
                    )
                );

                if ($send_message->sid) {
                    Log::info("SMS notification sent successfully for newly approved appointment ID: $appointmentId");
                } else {
                    Log::error("Failed to send SMS notification for newly approved appointment ID: $appointmentId");
                }
            } catch (\Exception $e) {
                Log::error("Exception while sending SMS notification for newly approved appointment ID: $appointmentId. Exception: " . $e->getMessage());
            }
        }
    }

    public function update(Request $request, $id)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $existingAppointment = Appointment::where('schedule', $request->schedule)
            ->where('time', $request->time)
            ->where('status', '!=', 3)
            ->where('id', '!=', $id)
            ->first();

        if ($existingAppointment) {
            $response['status'] = false;
            $response['message'] = 'An appointment with the same date and time already exists';
        } else {
            $data = [
                'appointment_type_id' => $request->appointment_type_id,
                'health_condition_id' => $request->health_condition_id,
                'schedule' => $request->schedule,
                'time' => $request->time,
                'reason' => $request->reason,
                // 'is_walk_in' => $request->is_walk_in, 
            ];


            $update_appointment = Appointment::where('id', $id)->update($data);

            if ($update_appointment) {
                $response['status'] = true;
                $response['message'] = "Appointment updated successfully";
                $response['payload'] = Appointment::with(['child', 'user', 'appointmentType', 'healthCondition'])->where('id', $id)->first();
            } else {
                $response['message'] = "Unauthorized";
            }
        }

        return $response;
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $response = [
            'status' => false,
        ];

        $program = Appointment::find($id);

        if ($program) {
            $program->delete();
            $response['status'] = true;
            $response['message'] = "Successfully Deleted";
            $response['payload'] = [
                'id' => $id,
                'method' => 'DELETE'
            ];
        } else {
            $response['message'] = "Unauthorized";
        }

        return $response;
    }

    public function sendReminders()
    {
        $today = Carbon::now();

        $workingHoursStart = Carbon::parse('9:00 AM');
        $workingHoursEnd = Carbon::parse('5:00 PM');

        $approvedAppointments = Appointment::where('status', 2)
            ->whereDate('schedule', $today->toDateString())
            ->whereBetween('schedule', [$workingHoursStart, $workingHoursEnd])
            ->get();

        foreach ($approvedAppointments as $appointment) {
            $appointmentTime = Carbon::parse($appointment->schedule);
            $reminderTime = $appointmentTime->subMinutes(30);

            if ($today->greaterThanOrEqualTo($reminderTime) && $today->lessThan($appointmentTime)) {
                $this->sendReminderSMS($appointment);
            }
        }
    }


    private function sendReminderSMS($appointment)
    {
        $twilioSid = env('TWILIO_SID');
        $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
        $twilioMessageServicingId = env('TWILIO_MESSAGING_SERVICE_ID');

        $client = new Client($twilioSid, $twilioAuthToken);

        $phoneNumber = '+63' . substr($appointment->user->phone_number, 1);
        $formattedDate = Carbon::parse($appointment->schedule)->format('F d, Y');
        $formattedTime = $appointment->time;

        $message = "Reminder: Your appointment for " . $appointment->appointmentType->name . " is scheduled on " . $formattedDate . " at " . $formattedTime . ". Please be prepared.";

        try {
            $send_message = $client->messages->create(
                $phoneNumber,
                array(
                    'messagingServiceSid' => $twilioMessageServicingId,
                    'body' => $message,
                )
            );

            if ($send_message->sid) {
                Log::info("Reminder SMS sent successfully for appointment ID: $appointment->id");
            } else {
                Log::error("Failed to send Reminder SMS for appointment ID: $appointment->id");
            }
        } catch (\Exception $e) {
            Log::error("Exception while sending Reminder SMS for appointment ID: $appointment->id. Exception: " . $e->getMessage());
        }
    }
}
