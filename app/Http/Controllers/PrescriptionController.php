<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Models\Prescription;
use App\Models\PrescriptionMedication;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $prescriptions = Prescription::with(['user', 'children', 'doctor.user', 'prescription_medications'])
            ->orderBy('id', 'desc')
            ->get();

        return $prescriptions;
    }

    public function listPrescriptionForWalkins()
    {
        $prescription = Prescription::whereNotNull('child')
            ->whereNotNull('parent')
            ->orderBy('id', 'desc')
            ->get();

        return $prescription;
    }

    public function listPrescriptionForOnline()
    {
        $prescription = Prescription::with(['user', 'children'])
            ->whereNotNull('child_id')
            ->whereNotNull('parent_id')
            ->orderBy('id', 'desc')
            ->get();

        return $prescription;
    }

    public function getPrescriptionsByParentAndChild($parent, $child, $type)
    {
        if ($type == "Online") {
            $diagnosis = Prescription::with(['user', 'children', 'doctor.user', 'prescription_medications'])
                ->where('parent_id', $parent)
                ->where('child_id', $child)
                ->orderBy('id', 'desc')->get();
        } else if ($type == "Walkins") {
            $diagnosis = Prescription::with(['user', 'children', 'doctor.user', 'prescription_medications'])
                ->where('parent', $parent)
                ->where('child', $child)
                ->orderBy('id', 'desc')->get();
        }
        return $diagnosis;
    }

    public function viewPrescription($id)
    {
        $prescription = Prescription::with(['user', 'children', 'doctor.user', 'prescription_medications'])
            ->where('id', $id)
            ->first();

        if ($prescription) {
            $data = [
                'prescription' => $prescription,
            ];

            $pdf = PDF::loadView('pdf.prescription', $data)->setOption(['defaultFont' => 'sans-serif'])
                ->setPaper([0, 0, 612, 792], 'portrait');

            return $pdf->stream('prescription.pdf');
        } else {
            return response()->json(['message' => 'Prescription not found.'], 404);
        }
    }


    public function getUserPrescriptions($parent_id)
    {
        $prescriptions = Prescription::with(['user', 'children', 'doctor.user', 'prescription_medications'])
            ->orderBy('id', 'desc')
            ->where('parent_id', $parent_id)
            ->get();

        return $prescriptions;
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
            'doctor_id' => $request->doctor_id,
            'weight' => $request->weight,
        ];

        if ($request->type === "Online") {
            $data['parent_id'] = $request->parent_id;
            $data['child_id'] = $request->child_id;
            $data['appointment_id'] = $request->appointment_id ?? '';
        } else if ($request->type === "Walk-ins") {
            $data['parent'] = $request->parent;
            $data['child'] = $request->child;
            $data['walkins_appointment_id'] = $request->walkins_appointment_id ?? '';
        }

        $create_prescription = Prescription::create($data);

        if ($create_prescription) {
            $response['status'] = true;
            $response['message'] = 'Prescription added successfully!';
            $response['payload'] = Prescription::with(['user', 'children', 'doctor.user', 'prescription_medications'])->where('id', $create_prescription->id)->first();
        } else {
            $response['message'] = 'Unauthorized';
        }

        return $response;
    }

    public function showMedication($id)
    {
        return PrescriptionMedication::orderBy('id', 'desc')->where('prescription_id', $id)->get();
    }

    public function storeMedication(Request $request)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $data = [
            'prescription_id' => $request->prescription_id,
            'details' => $request->details,
            'taken' => $request->taken,
            'remarks' => $request->remarks,
        ];

        $create_prescription_medication = PrescriptionMedication::create($data);

        if ($create_prescription_medication) {
            $response['status'] = true;
            $response['message'] = 'Prescription Medication added successfully!';
            $response['payload'] = PrescriptionMedication::where('id', $create_prescription_medication->id)->first();
        } else {
            $response['message'] = 'Unauthorized';
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
        $prescription = Prescription::with(['user', 'children', 'doctor.user', 'prescription_medications'])->find($id);

        if ($prescription) {
            return $prescription;
        } else {
            return response()->json(['message' => 'Prescription not found.'], 404);
        }
    }

    public function showByChildId($id)
    {
        $prescription = Prescription::with(['user', 'children', 'doctor.user', 'prescription_medications'])->where('child_id', $id)->get();

        if ($prescription) {
            return $prescription;
        } else {
            return response()->json(['message' => 'Prescription not found.'], 404);
        }
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

    public function updateMedication(Request $request, $id)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $prescriptionMedication = PrescriptionMedication::find($id);

        if ($prescriptionMedication) {
            $prescriptionMedication->update([
                'details' => $request->details,
                'taken' => $request->taken,
                'remarks' => $request->remarks,
            ]);

            $response['status'] = true;
            $response['message'] = 'Prescription Medication updated successfully!';
            $response['payload'] =    $response['payload'] = PrescriptionMedication::where('id', $id)->first();
        } else {
            $response['message'] = 'Prescription Medication not found.';
        }

        return $response;
    }

    public function destroyMedication(Request $request, $id)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $prescriptionMedication = PrescriptionMedication::find($id);

        if ($prescriptionMedication) {
            $prescriptionMedication->delete();
            $response['status'] = true;
            $response['message'] = 'Prescription Medication deleted successfully!';
            $response['payload'] = [
                'id' => $id,
                'method' => 'DELETE'
            ];
        } else {
            $response['message'] = 'Prescription Medication not found.';
        }

        return $response;
    }


    public function destroy($id)
    {
        $response = [
            'status' => false,
        ];

        $program = Prescription::find($id);

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
}
