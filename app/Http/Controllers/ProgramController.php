<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProgramController extends Controller
{

    public function get_program_and_project()
    {

        return Program::with('projects.immunization')->withCount('immunization', 'projects')->get();
    }

    public function index()
    {
        return Program::orderBy('id', 'desc')->get();
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
            'prog_title' => $request->prog_title,
            'prog_desc' => $request->prog_desc,
            'status' => $request->status,
        ];


        $insert_programs = Program::create($data);

        if ($insert_programs) {
            $response['status'] = true;
            $response['message'] = "Successfully Added";
            $response['payload'] = Program::where('id', $insert_programs->id)->first();
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
        $get_data = DB::table('programs')
            ->join('immunizations', 'immunizations.program_id', 'programs.id')
            ->select('programs.*', DB::raw("count(immunizations.program_id) as count"))
            ->where('programs.id', $id)
            ->groupBy('immunizations.program_id')
            ->orderBy('programs.address', 'asc')
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

    public function update(Request $request, $id)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $data = [
            'prog_title' => $request->prog_title,
            'prog_desc' => $request->prog_desc,
            'status' => $request->status,
        ];

        $update_programs = Program::where('id', $id)->update($data);

        if ($update_programs) {
            $response['status'] = true;
            $response['message'] = "Successfully Update";
            $response['payload'] = Program::where('id', $id)->first();
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

        $program = Program::find($id);

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
