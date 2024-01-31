<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Models\Diagnosis;
use App\Models\Outpatient;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class DiagnosisController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Diagnosis::with(['user', 'children'])->orderBy('id', 'desc')->get();
    }

    public function getDiagnosisByParentAndChild($parent, $child, $type)
    {
        if ($type == "Online") {
            $diagnosis = Diagnosis::with(['user', 'children'])
                ->where('parent_id', $parent)
                ->where('child_id', $child)
                ->orderBy('id', 'desc')->get();
        } else if ($type == "Walkins") {
            $diagnosis = Diagnosis::where('parent', $parent)
                ->where('child', $child)
                ->orderBy('id', 'desc')->get();
        }
        return $diagnosis;
    }

    public function viewOnlineDiagnosis($id)
    {
        $diagnosis = Diagnosis::where('child_id', $id)->get();

        $child = Child::with('user')->where('id', $id)->first();

        if ($diagnosis->isEmpty()) {
            return response()->json(['message' => 'Diagnosis not found.'], 404);
        }

        $data = [
            'name' => $child->name,
            'child' => $child,
            'diagnosis' => $diagnosis,
        ];

        // return $data;

        $pdf = PDF::loadView('pdf.diagnosis', $data)->setOption(['defaultFont' => 'sans-serif'])
            ->setPaper('a5', 'landscape');

        return $pdf->stream('diagnosis.pdf');
    }

    public function viewWalkinsDiagnosis($child)
    {
        $diagnosis = Diagnosis::where('child', $child)->get();

        $childData = Outpatient::where('child', $child)->first();

        if ($diagnosis->isEmpty()) {
            return response()->json(['message' => 'Diagnosis not found.'], 404);
        }

        $data = [
            'name' => $child,
            'child' => $childData,
            'diagnosis' => $diagnosis,
        ];

        // return $data;

        $pdf = PDF::loadView('pdf.diagnosis', $data)->setOption(['defaultFont' => 'sans-serif'])
            ->setPaper('a5', 'landscape');

        return $pdf->stream('diagnosis.pdf');
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

        if ($request->type === "Online") {
            $existingDiagnosis = Diagnosis::where('parent_id', $request->parent_id)
                ->where('child_id', $request->child_id)
                ->where('schedule', $request->schedule)
                ->first();
        } else if ($request->type === "Walk-ins") {
            $existingDiagnosis = Diagnosis::where('parent', $request->parent)
                ->where('child', $request->child)
                ->where('schedule', $request->schedule)
                ->first();
        }

        if ($existingDiagnosis) {
            $response['message'] = "This diagnosis is already stored";
        } else {
            $data = [
                'schedule' => $request->schedule,
                'age' => $request->age,
                'weight' => $request->weight,
                'height' => $request->height,
                'notes' => $request->notes,
            ];

            if ($request->type === "Online") {
                $data['parent_id'] = $request->parent_id;
                $data['child_id'] = $request->child_id;
                $data['appointment_id'] = $request->appointment_id ?? '';
            } else if ($request->type === "Walk-ins") {
                $data['parent'] = $request->parent;
                $data['child'] = $request->child;
            }

            $insertDiagnosis = Diagnosis::create($data);

            if ($insertDiagnosis) {
                $response['status'] = true;
                $response['message'] = "Successfully Added";
                $response['payload'] = Diagnosis::with(['user', 'children'])->find($insertDiagnosis->id);
            } else {
                $response['message'] = "Error in creating diagnosis";
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

        $diagnosis = Diagnosis::find($id);

        if ($diagnosis) {
            $diagnosis->delete();
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
