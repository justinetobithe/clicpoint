<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $patients = Patient::join('users', 'patients.user_id', 'users.id')
            ->select('patients.*', 'users.name', 'users.email', 'users.role', 'users.status')
            ->get();

        return response()->json($patients);
    }

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

        $data = [
            'parent_id' => $request->parent_id,
            'name' => $request->name,
            'date_of_birth' => $request->date_of_birth,
            'place_of_birth' => $request->place_of_birth,
            'gender' => $request->gender,
            'status' => 1,
        ];


        $insert_patient = Patient::create($data);

        if ($insert_patient) {
            $response['status'] = true;
            $response['message'] = "Successfully Added";
            $response['payload'] = Patient::where('id', $insert_patient->id)->first();
        } else {
            $response['message'] = "Unauthorized";
        }


        return $response;
    }

    //Get patient/children
    public function show($id)
    {
        return Patient::where('user_id', $id)->first();
    }

    public function show_patient($id)
    {
        return Patient::where('id', $id)->first();
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
            'message' => 'There was an error'
        ];

        $data = [
            'name' => $request->name,
            'date_of_birth' => $request->date_of_birth,
            'place_of_birth' => $request->place_of_birth,
            'gender' => $request->gender,
        ];

        $update_patient = Patient::where('id', $id)->update($data);

        if ($update_patient) {
            $response['status'] = true;
            $response['message'] = "Successfully Added";
            $response['payload'] = Patient::where('id', $id)->first();
        } else {
            $response['message'] = "Unauthorized";
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

        $patient = Patient::where('id', $id)->first();

        if ($patient) {
            $patient->delete();
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
