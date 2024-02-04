<?php

namespace App\Http\Controllers;

use App\Models\WalkInAppointment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class WalkInAppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return WalkInAppointment::with(['appointmentType', 'healthCondition'])->orderBy('id', 'desc')->get();
    }

    public function filterWalkInAppointmentsByDate()
    {
        $appointments = WalkInAppointment::with(['appointmentType', 'healthCondition']);

        if (isset($_GET['filterDate'])) {
            $date = $_GET['filterDate'];
            $appointments->whereDate('schedule', $date);
        }

        $appointments->orderByRaw('status = 2 DESC');

        $appointments->orderBy('id', 'desc');

        $appointments = $appointments->get();

        if ($appointments->isEmpty()) {
            return response()->json(['message' => 'No data found for the specified date'], 404);
        }

        return $appointments;
    }

    public function getAppointmentHistory($parent, $child)
    {
        $appointments = WalkInAppointment::with(['appointmentType', 'healthCondition', 'diagnosis', 'prescription.prescription_medications'])
            ->when($parent, function ($query) use ($parent) {
                return $query->where('parent', $parent);
            })
            ->when($child, function ($query) use ($child) {
                return $query->where('child', $child);
            })
            ->orderBy('schedule')
            ->orderBy('parent')
            ->orderBy('child')
            ->get();

        return $appointments;
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
            'message' => "There was an error"
        ];

        $today = Carbon::now();

        $data = [
            'parent' => $request->parent,
            'child' => $request->child,
            'appointment_type_id' => $request->appointment_type_id,
            'health_condition_id' => $request->health_condition_id,
            'reason' => $request->reason,
            'schedule' => $today,
        ];

        $insertWalkIns = WalkInAppointment::create($data);

        if ($insertWalkIns) {
            $response['status'] = true;
            $response['message'] = "Successfully Added";
            $response['payload'] = WalkInAppointment::find($insertWalkIns->id);
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
        //
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

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $response = [
            'status' => false,
            'message' => "There was an error",
        ];

        $data = $request->all();

        $walkInAppointment = WalkInAppointment::find($id);

        if ($walkInAppointment) {
            if ($data['status'] != 'Cancel') {
                $walkInAppointment->update([
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'status' => $data['status'],
                ]);
            }

            $response['status'] = true;
            $response['message'] = "Successfully Updated";
            $response['payload'] = WalkInAppointment::with(['appointmentType', 'healthCondition'])->where('id', $id)->first();
        } else {
            $response['message'] = "Appointment not found";
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
            'status' => false
        ];


        $walkInsAppointment = WalkInAppointment::find($id);

        if ($walkInsAppointment) {
            $walkInsAppointment->delete();
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
}
