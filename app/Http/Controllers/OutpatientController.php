<?php

namespace App\Http\Controllers;

use App\Models\Outpatient;
use Illuminate\Http\Request;

class OutpatientController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Outpatient::orderBy('id', 'desc')->get();
    }

    public function distinctParents()
    {
        $distinctParents = Outpatient::select('parent')->distinct()->get();

        return response()->json($distinctParents);
    }

    public function childrenByParent($parent)
    {
        $children = Outpatient::select('*')->where('parent', $parent)->distinct()->get();

        return response()->json($children);
    }

    public function allChildren()
    {
        $allChildren = Outpatient::select('child')->orderBy('child', 'asc')->get();

        return response()->json($allChildren);
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
            'parent' => $request->parent,
            'child' => $request->child,
            'address' => $request->address,
            'date_of_birth' => $request->date_of_birth,
            'phone_number' => $request->phone_number,
            'gender' => $request->gender,
            'relationship' => $request->relationship,
        ];

        $existingRecord = Outpatient::where('parent', $data['parent'])
            ->where('child', $data['child'])
            ->first();

        if ($existingRecord) {
            $response['message'] = 'Record with the same parent and child already exists';
        } else {
            $insert_data = Outpatient::create($data);

            if ($insert_data) {
                $response['status'] = true;
                $response['message'] = 'Successfully Added';
                $response['payload'] = Outpatient::where('id', $insert_data->id)->first();
            } else {
                $response['message'] = 'Unauthorized';
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
        //
    }

    public function getDetailsByParent($parent)
    {
        return Outpatient::where('parent', $parent)->first();
    }

    public function getDetailsByChildAndParent($parent, $child)
    {
        return Outpatient::where('parent', $parent)->where('child', $child)->first();
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
            'parent' => $request->parent,
            'child' => $request->child,
            'address' => $request->address,
            'date_of_birth' => $request->date_of_birth,
            'place_of_birth' => $request->place_of_birth,
            'gender' => $request->gender,
            'relationship' => $request->relationship,
        ];


        $update_data = Outpatient::create($data);

        if ($update_data) {
            $response['status'] = true;
            $response['message'] = "Successfully Updated";
            $response['payload'] = Outpatient::where('id', $id)->first();
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

        $outpatient = Outpatient::where('id', $id)->first();

        if ($outpatient) {
            $outpatient->delete();
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
