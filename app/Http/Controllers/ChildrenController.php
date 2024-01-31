<?php

namespace App\Http\Controllers;

use App\Models\Child;
use Illuminate\Http\Request;
use Throwable;

class ChildrenController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Child::with('user')->orderBy('id', 'desc')->get();
    }

    public function getTotalChildrenCount()
    {
        $totalChildrensCount = Child::count();

        return $totalChildrensCount;
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

        $existingChild = Child::where('name', $request->name)
            ->where('date_of_birth', $request->date_of_birth)
            ->first();

        if ($existingChild) {
            $response['message'] = 'Child with the same name and birthdate already exists!';
        } else {
            try {
                $create_child = Child::create([
                    'name' => $request->name,
                    'gender' => $request->gender,
                    'date_of_birth' => $request->date_of_birth,
                    'place_of_birth' => $request->place_of_birth,
                    'relationship' => $request->relationship,
                    'parent_id' => $request->parent_id,
                ]);

                if ($create_child) {
                    $response['status'] = true;
                    $response['message'] = 'Child record added successfully!';
                    $response['payload'] = Child::where('id', $create_child->id)->first();
                } else {
                    $response['message'] = 'Unauthorized';
                }
            } catch (Throwable $e) {
                $response['message'] = $e->getMessage();
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
        return Child::with('user')->orderBy('id', 'desc')->where('parent_id', $id)->get();
    }

    public function showChildDetails($id)
    {
        return Child::with('user')->find($id);
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

        $existingChild = Child::where('name', $request->name)
            ->where('date_of_birth', $request->date_of_birth)
            ->where('id', '!=', $id)
            ->first();

        if ($existingChild) {
            $response['message'] = 'A child with the same name and birthdate already exists';
        } else {
            try {
                $child = Child::find($id);

                if (!$child) {
                    $response['message'] = 'Child not found';
                } else {
                    $child->update([
                        'name' => $request->name,
                        'gender' => $request->gender,
                        'date_of_birth' => $request->date_of_birth,
                        'place_of_birth' => $request->place_of_birth,
                        'relationship' => $request->relationship,
                        'parent_id' => $request->parent_id,
                    ]);

                    $response['status'] = true;
                    $response['message'] = 'Child record updated successfully';
                    $response['payload'] = Child::find($id);
                }
            } catch (Throwable $e) {
                $response['message'] = $e->getMessage();
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

        $child = Child::where('id', $id)->first();

        if ($child) {
            $child->delete();
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
