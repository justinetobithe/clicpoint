<?php

namespace App\Http\Controllers;

use App\Mail\VerificationMail;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error',
        ];

        $user = User::where('email', $request->email)->first();

        if ($user) {
            if (!empty($request->password) && !password_verify($request->password, $user->password)) {
                $response['message'] = "Invalid Password";
            } elseif ($user->verified !== 1) {
                $response['message'] = "Your account is not verified yet. Please check your email for the verification link.";
            } else {
                $credentials = $request->only('email', 'password');
                if (Auth::attempt($credentials)) {
                    $response['status'] = true;
                    $response['message'] = 'Successfully Login';
                    $response['user'] = Auth::user();

                    $token = Auth::user()->createToken('token')->plainTextToken;
                    $cookie = cookie('jwt', $token, 60 * 24);

                    return response()->json($response)->withCookie($cookie);
                }
            }
        } else {
            $response['message'] = "Account does not exist";
        }

       return $response;
    }

    public function mobileLogin(Request $request)
    {
        return $request;
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $user = User::where('email', $request->email)->first();

        if ($user) {
            if (isset($request->password) && !password_verify($request->password, $user->password)) {
                $response['message'] = "Invalid Password";
            } else {
                $credentials = $request->only('email', 'password');
                if (Auth::attempt($credentials)) {

                    $user->load('doctor');

                    $response['status'] = true;
                    $response['message'] = 'Succesfully Login';

                    $response['user'] = $user;

                    $expires_in = 60 * 24;
                    $token = $user->createToken('token')->plainTextToken;
                    $response['access_token'] = $token;
                    $response['token_type'] = "bearer";
                    $response['expires_in'] = $expires_in;
                    $response['cookie'] = cookie('jwt', $response['access_token'], $expires_in);

                    $cookie = cookie("jwt", $token, 60 * 24);

                    return response()->json($response)->withCookie($cookie);
                }
            }
        } else {
            $response['message'] = "Account does not exist";
        }


        return $response;
    }

    // public function login(Request $request)
    // {
    //     $response = [
    //         'status' => false,
    //         'message' => 'There was an error'
    //     ];

    //     $user = User::select('id', 'name', 'role', 'password')->where('email', $request->email)->first();

    //     if ($user) {
    //         if (isset($request->password) && !password_verify($request->password, $user->password)) {
    //             $response['message'] = "Invalid Password";
    //         } else {
    //             $credentials = $request->only('email', 'password');
    //             // if ($user->role == 0) {
    //             //     $response['message'] = "Your account is not yet verified";
    //             // } else
    //             if (Auth::attempt($credentials)) {
    //                 $response['status'] = true;
    //                 $response['message'] = '✔️ Succesfully Login';

    //                 $response['user'] = Auth::user();

    //                 $token = Auth::user()->createToken('token')->plainTextToken;
    //                 $cookie = cookie('jwt', $token, 60 * 24);

    //                 return response($response)->withCookie($cookie);
    //             }
    //         }
    //     } else {
    //         $response['message'] = "Account does not exist";
    //     }


    //     return $response;
    // }

    public function logout()
    {
        $response = [
            'status' => false
        ];


        if (Auth::logout()) {
            $cookie = Cookie::forget('jwt');
            response("Sucessfully logout.")->withCookie($cookie);
            redirect('/');
            $response['true'] = true;
        }

        return $response;
    }

    public function register(Request $request)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $response['message'] = 'Your email is already exist!';
        } else {
            try {
                $token = Str::random(60);

                $create_user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'role' => 1,
                    'password' => Hash::make($request->password),
                    'birthdate' => $request->birthdate,
                    'gender' => $request->gender,
                    'address' => $request->address,
                    'phone_number' => $request->phone_number,
                    'status' => 2,
                    'remember_token' => $token,
                ]);

                if ($create_user) {
                    $verificationLink = route('verify.email', ['token' => $token]);

                    Mail::to($create_user->email)->send(new VerificationMail($create_user, $verificationLink));

                    $response['status'] = true;
                    $response['message'] = 'Successfully Registered! A verification email has been sent.';
                    $response['payload'] = json_encode([
                        'user' => $create_user,
                    ]);
                } else {
                    $response['message'] = 'Unauthorized';
                }
            } catch (Throwable $e) {
                $response['message'] = $e->getMessage();
            }
        }

        return $response;
    }

    public function mobileRegister(Request $request)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error'
        ];

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $response['message'] = 'Your email is already exist!';
        } else {
            try {
                $create_user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'role' => 1,
                    'password' => Hash::make($request->password),
                    'status' => 2,
                    'birthdate' => $request->birthdate,
                    'gender' => $request->gender,
                    'address' => $request->address,
                    'phone_number' => $request->phone_number,
                ]);

                if ($create_user) {
                    $response['status'] = true;
                    $response['message'] = 'Successfully Registered!';
                } else {
                    $response['message'] = 'Unauthorized';
                }
            } catch (Throwable $e) {
                $response['message'] = $e->getMessage();
            }
        }

        return $response;
    }

    public function mobileLogout(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            $user->tokens->each(function ($token) {
                $token->delete();
            });

            $response = [
                'status' => true,
                'message' => 'Successfully logged out from mobile device.'
            ];
        } else {
            $response = [
                'status' => false,
            ];
        }

        return response()->json($response);
    }



    // public function register(Request $request)
    // {
    //     $response = [
    //         'status' => false,
    //         'message' => 'There was an error'
    //     ];

    //     $user = User::where('email', $request->email)->first();


    //     if ($user) {
    //         $response['message'] = 'Your email is already exist!';
    //     } else {
    //         try {
    //             $create_user = User::create([
    //                 'name' => $request->name,
    //                 'email' => $request->email,
    //                 'role' => 1,
    //                 'password' => Hash::make($request->password),
    //                 'status' =>  2,
    //             ]);

    //             if ($create_user) {
    //                 $response['status'] = true;
    //                 $response['message'] = 'Succesfully Registered!';
    //                 $response['payload'] = json_encode([
    //                     'users' => [
    //                         'name' => $create_user->name,
    //                         'email' => $create_user->email,
    //                         'role' => $create_user->role,
    //                         'password' => $create_user->password,
    //                         'status' => $create_user->status,
    //                     ]
    //                 ]);
    //             } else {
    //                 $response['message'] = 'Unauthorized';
    //             }
    //         } catch (Throwable $e) {
    //             $response['message'] = $e->getMessage();
    //         }
    //     }

    //     return $response;
    // }
}
