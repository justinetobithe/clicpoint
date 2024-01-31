<?php

namespace App\Http\Controllers;

use App\Models\PasswordReset;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ResetPasswordController extends Controller
{
    public function setNewPassword(Request $request)
    {
        $response = [
            'status' => false,
            'message' => 'There was an error.',
        ];

        $validator = Validator::make($request->all(), [
            'newPassword' => ['required', 'string', 'min:6'],
            'token' => ['required', 'string']
        ]);

        if ($validator->fails()) {
            $response['message'] = $validator->errors()->first();
            return $response;
        }

        $token = $request->token;
        $newPassword = $request->newPassword;

        $passwordReset = PasswordReset::where('token', $token)->first();

        if (!$passwordReset || $this->tokenExpired($passwordReset)) {
            $response['message'] = 'The password reset token is invalid or has expired.';
            return $response;
        }

        if ($passwordReset->is_used == 1) {
            $response['message'] = 'Invalid token.';
            return $response;
        }

        $user = User::where('email', $passwordReset->email)->first();

        if (!$user) {
            $response['message'] = 'User not found.';
            return $response;
        }

        if (Hash::check($newPassword, $user->password)) {
            $response['message'] = 'You cannot use your current password as the new password.';
            return $response;
        }

        $user->password = Hash::make($newPassword);
        $user->update();

        $passwordReset->is_used = 1;
        $passwordReset->updated_at = Carbon::now();
        $passwordReset->update();

        $response['status'] = true;
        $response['message'] = 'Your password has been successfully updated.';
        return $response;
    }

    public function validateToken($token)
    {
        $response = [
            'status' => false,
            'message' => "There was an error"
        ];

        $passwordResets = PasswordReset::where('token', $token)->first();

        if (!$passwordResets) {
            $response['message'] = 'Token not found.';
            $response['status'] = false;
        } else if ($passwordResets->is_used == 1) {
            $response['message'] = 'Your session is expired.';
            $response['status'] = false;
        } else {
            if ($passwordResets->expires_at < Carbon::now()->format('Y-m-d H:i:s')) {
                $response['message'] = 'Token has expired.';
                $response['status'] = false;
            } else {
                $response['status'] = true;
                $response['message'] = 'Token is valid';
            }
        }

        return $response;
    }


    public function tokenExpired($passwordReset)
    {
        $expiresAt = Carbon::parse($passwordReset->expires_at);
        return $expiresAt->isPast();
    }
}
