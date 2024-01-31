<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\PrescriptionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/print/prescription/{id}', [PrescriptionController::class, 'viewPrescription']);
Route::get('/print/diagnosis/online/{id}', [DiagnosisController::class, 'viewOnlineDiagnosis']);
Route::get('/print/diagnosis/walkins/{child}', [DiagnosisController::class, 'viewWalkinsDiagnosis']);

Route::get('/{any}', function () {
    $user = [];
    $auth = Auth::user();
    if ($auth) {
        $user = $auth->only(['id', 'name', 'email', 'birthdate', 'gender', 'address', 'phone_number', 'role']);
    }
    return view('index')->with(['user' => collect($user)]);
})->where('any', '.*');
