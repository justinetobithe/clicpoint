<?php

namespace App\Http\Controllers;

use App\Models\Vaccine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VaccineController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Vaccine::orderBy('vaccine', 'asc')->get();
    }

    public function get_vaccines()
    {
        $get_data = DB::table('vaccines')
            ->select('*');

        if ($_GET['filterName'] != null) {
            $get_data = $get_data->where('vaccine', 'like', '%' . $_GET['filterName'] . '%')->orderBy('vaccine', 'asc')->get();
        } else {
            $get_data = $get_data->orderBy('vaccine', 'asc')->get();
        }

        return $get_data;
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

        $data = [
            'vaccine' => $request->vaccine,
            'description' => $request->description,
            'added_by' => $request->added_by,
            'remarks' => $request->remarks,
            'status' => 1,
        ];

        $insert_vaccine = Vaccine::create($data);

        if ($insert_vaccine) {
            $response['status'] = true;
            $response['message'] = "Successfully Added";
            $response['payload'] = Vaccine::where('id', $insert_vaccine->id)->first();
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
            'message' => 'There was an error'
        ];

        $data = [
            'vaccine' => $request->vaccine,
            'description' => $request->description,
            'remarks' => $request->remarks,
        ];

        $update_vaccine = Vaccine::where('id', $id)->update($data);

        if ($update_vaccine) {
            $response['status'] = true;
            $response['message'] = "Successfully Update.";
            $response['payload'] = Vaccine::where('id', $id)->first();
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
            'status' => false
        ];


        $vaccine = Vaccine::find($id);

        if ($vaccine) {
            $vaccine->delete();
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
