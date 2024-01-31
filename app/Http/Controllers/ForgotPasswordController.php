<?php

namespace App\Http\Controllers;

use App\Mail\ResetPasswordMail;
use App\Models\PasswordReset;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error.',
        ];

        $email = $request->email;

        $user = User::where('email', $email)->first();

        if ($user) {
            $generateToken = $this->generateRandomString();

            $passwordResets = PasswordReset::where('email', $email)->first();

            $passwordResets = PasswordReset::create([
                'email' => $email,
                'token' => $generateToken,
                'created_at' => Carbon::now(),
                'expires_at' => Carbon::now()->addHours(10)->format('Y-m-d H:i:s')
            ]);

            if ($passwordResets) {
                $baseUrl = config('app.url');

                if (str_contains($baseUrl, 'localhost')) {
                    $baseUrl .= ':8000';
                }

                $verificationLink = $baseUrl . '/set-password' . '/' . $passwordResets->token;

                Mail::to($request->email)->send(new ResetPasswordMail($user, $verificationLink));

                $response['status'] = true;
                $response['message'] = 'Success! An email has been sent to help you reset your password';
            }
        } else {
            $response['message'] = 'Account does not exist';
        }

        return $response;
    }

    function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}
