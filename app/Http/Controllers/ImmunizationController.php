<?php

namespace App\Http\Controllers;

use App\Models\Immunization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ImmunizationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $immunizations = Immunization::with(['user', 'children', 'vaccine'])
            ->orderBy('id', 'desc')
            ->get();

        return $immunizations;
    }

    // For Walk ins
    public function getChildImmunizationsByName($child)
    {
        $childImmunizations = Immunization::with(['user', 'children', 'vaccine'])
            ->where('child', $child)
            ->orderBy('id', 'desc')
            ->get();


        return $childImmunizations;
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

        $check_immunization = Immunization::where('child_id', $request->child_id)
            ->where('vaccine_id', $request->vaccine_id)
            ->where('remarks', $request->remarks)
            ->where(function ($query) use ($request) {
                if ($request->type === "Online") {
                    $query->where('parent_id', $request->parent_id);
                } else if ($request->type === "Walk-ins") {
                    $query->where('parent', $request->parent)
                        ->where('child', $request->child);
                }
            })
            ->first();

        if ($check_immunization) {
            $response['message'] = "This vaccine is already vaccinated";
        } else {
            $data = [
                'child_id' => $request->child_id,
                'vaccine_id' => $request->vaccine_id,
                'date_vaccinated' => $request->date_vaccinated,
                'remarks' => $request->remarks,
            ];

            if ($request->type === "Online") {
                $data['parent_id'] = $request->parent_id;
                $data['child_id'] = $request->child_id;
            } else if ($request->type === "Walk-ins") {
                $data['parent'] = $request->parent;
                $data['child'] = $request->child;
            }

            $insert_immunization = Immunization::create($data);

            if ($insert_immunization) {
                $response['status'] = true;
                $response['message'] = "Successfully Added";
                $response['payload'] = Immunization::with(['user', 'children', 'vaccine'])
                    ->find($insert_immunization->id);
            } else {
                $response['message'] = "Unauthorized";
            }
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
        $get_data = Immunization::with(['user', 'children', 'vaccine'])
            ->where('immunizations.child_id', $id)
            ->get();

        return $get_data;
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
        //
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

        $immunization = Immunization::find($id);

        if ($immunization) {
            $immunization->delete();
            $response['status'] = true;
            $response['message'] = "Successfully Deleted";
            $response['payload'] = [
                'id' => $id,
                'method' => "DELETE"
            ];
        } else {
            $response['message'] = "Unauthorized";
        }

        return $response;
    }
}
