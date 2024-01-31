<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $get_data =  DB::table('projects')
            ->leftJoin('programs', 'programs.id', 'projects.program_id')
            ->select('projects.*', 'programs.prog_title')
            ->orderBy('projects.id', 'asc')
            ->get();

        return $get_data;
    }

    public function get_projects()
    {
        $get_data = DB::table('projects')
            ->leftJoin('programs', 'programs.id', 'projects.program_id')
            ->select('projects.*', 'programs.prog_title');

        if ($_GET['filterProgram'] != null) {
            $get_data = $get_data->where('programs.id', $_GET['filterProgram']);
        }
        if ($_GET['filterName'] != null) {
            $get_data = $get_data->where('projects.proj_title', 'like', '%' . $_GET['filterName'] . '%');
        }

        $get_data = $get_data->orderBy('id', 'asc')->get();


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
            'program_id' => $request->program_id,
            'proj_title' => $request->proj_title,
            'address' => $request->address,
            'date_started' => $request->date_started,
            'date_ended' => $request->date_ended,
            'status' => $request->status,
        ];


        $insert_project = Project::create($data);

        if ($insert_project) {
            $response['status'] = true;
            $response['message'] = "Successfully Added";
            $response['payload'] = DB::table('projects')
                ->leftJoin('programs', 'programs.id', 'projects.program_id')
                ->select('projects.*', 'programs.prog_title')
                ->where('projects.id', $insert_project->id)
                ->first();
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
        return Project::where('program_id', $id)->orderBy('proj_title', 'asc')->get();
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
            // 'program_id' => $request->program_id,
            'proj_title' => $request->proj_title,
            'address' => $request->address,
            'date_started' => $request->date_started,
            'date_ended' => $request->date_ended,
            'status' => $request->status,
        ];

        $update_project = Project::where('id', $id)->update($data);

        if ($update_project) {
            $response['status'] = true;
            $response['message'] = "Successfully Added";
            $response['payload'] = DB::table('projects')
                ->leftJoin('programs', 'programs.id', 'projects.program_id')
                ->select('projects.*', 'programs.prog_title')
                ->where('projects.id', $id)
                ->first();
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

        $project = Project::find($id);

        if ($project) {
            $project->delete();
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
