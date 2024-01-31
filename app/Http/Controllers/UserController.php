<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Throwable;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() // read
    {
        return User::with('doctor')->orderBy('id', 'desc')->get();
    }

    public function verifyEmail($token)
    {
        $user = User::where('remember_token', $token)->first();

        if (!$user) {
            return 'Invalid verification token.';
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            $user->update(['verified' => 1, 'remember_token' => null]);

            $message = 'Email verified successfully. Redirecting to login...';

            return view('emails.verification-success', compact('message'));
        } else {
            return 'Email already verified.';
        }
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
    public function store(Request $request) // create
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $check_email = User::where('email', $request->email)->first();

        if ($check_email) {
            $response['message'] = 'Account already exists!';
        } else {
            $user = new User([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'gender' => $request->gender,
                'birthdate' => $request->birthdate,
                'address' => $request->address,
                'phone_number' => $request->phone_number,
                'status' => 2,
            ]);

            $user->save();

            if ($user) {
                $response['status'] = true;
                $response['message'] = 'Successfully Added';
                $response['payload'] = json_encode([
                    'users' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'gender' => $user->gender,
                        'birthdate' => $user->birthdate,
                        'address' => $user->address,
                        'phone_number' => $user->phone_number,
                        'status' => $user->status,
                    ]
                ]);

                if ($request->role == 3) {
                    $doctor = new Doctor([
                        'user_id' => $user->id,
                        'specialization' => $request->specialization,
                        'license_number' => $request->license_number,
                        'ptr_number' => $request->ptr_number,
                        'clinic_address' => $request->clinic_address,
                        'bio' => $request->bio,
                        'consultation_fee' => $request->consultation_fee,
                        'availability' => $request->availability,
                    ]);

                    $doctor->save();
                }
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
    public function show($id) // read
    {
        $user = User::find($id);

        return $user;
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

    public function update(Request $request, $id) // update
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $user = User::find($id);

        if (!$user) {
            $response['message'] = 'User not found';
            return $response;
        }

        if ($request->filled(['currentPassword', 'newPassword'])) {
            if (Hash::check($request->currentPassword, $user->password)) {
                $user->password = Hash::make($request->newPassword);

                if ($user->save()) {
                    $response['status'] = true;
                    $response['message'] = "Password Successfully Changed!";
                } else {
                    $response['message'] = "An error occurred while saving the password.";
                }
            } else {
                $response['message'] = "Invalid Current Password!";
            }
        } else {
            $response['message'] = "Both current and new passwords are required.";
        }

        $user->address = $request->input('address', $user->address);
        $user->phone_number = $request->input('phone_number', $user->phone_number);

        if ($user->save()) {
            $response['status'] = true;
            $response['message'] = "User Information Successfully Updated!";
        } else {
            $response['message'] = "An error occurred while saving user information.";
        }

        if ($user->role == 3 && $request->filled(['specialization', 'license_number', 'ptr_number', 'clinic_address', 'bio', 'consultation_fee', 'availability'])) {
            $doctor = Doctor::where('user_id', $user->id)->first();

            if ($doctor) {
                $doctor->update($request->only(['specialization', 'license_number', 'ptr_number', 'clinic_address', 'bio', 'consultation_fee', 'availability']));
            } else {
                $doctor = new Doctor($request->only(['specialization', 'license_number', 'ptr_number', 'clinic_address', 'bio', 'consultation_fee', 'availability']));
                $doctor->user_id = $user->id;
                $doctor->save();
            }
        }

        return $response;
    }



    // public function update(Request $request, $id)
    // {
    //     $response = [
    //         'status' => false,
    //         'message' => 'There was an error'
    //     ];

    //     $user = User::where('id', $id)->first();
    //     // dd(Auth::user()->password);

    //     if ($request->currentPassword !== null && $request->newPassword !== null) {
    //         // if (Hash::check($request->currentPassword, Auth::user()->password)) {
    //         if (Hash::check($request->currentPassword, Auth::user()->password)) {
    //             // Change Password

    //             $user->password = Hash::make($request->newPassword);

    //             // Set response
    //             $response['password_changed'] = true;

    //             if ($user->update()) {
    //                 $response['status'] = true;
    //                 $response['message'] = "Password Successfully Changed!";
    //             }
    //         } else {
    //             $response['message'] = "Invalid Current Password!";
    //         }
    //     }
    //     return $response;
    // }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) // delete
    {
        $response = [
            'status' => false,
        ];

        $user = User::find($id);

        if ($user) {
            $user->delete();
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
