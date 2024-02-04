<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentTypeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChildrenController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\HealthConditionController;
use App\Http\Controllers\ImmunizationController;
use App\Http\Controllers\OutpatientController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VaccineController;
use App\Http\Controllers\WalkInAppointmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::post('/login', [AuthController::class, 'login']);
Route::post('/mobile-login', [AuthController::class, 'mobileLogin']);
Route::post('/mobile-logout', [AuthController::class, 'mobileLogout']);
Route::post('/mobile-register', [AuthController::class, 'mobileRegister']);

Route::get('/verify-email/{token}', [UserController::class, 'verifyEmail'])->name('verify.email');
Route::get('/validate-token/{token}', [ResetPasswordController::class, 'validateToken']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('/set-password', [ResetPasswordController::class, 'setNewPassword']);

Route::resource('users', UserController::class);
Route::resource('patients', PatientController::class);
Route::resource('immunizations', ImmunizationController::class);
Route::resource('vaccines', VaccineController::class);
Route::resource('appointments', AppointmentController::class);
Route::resource('appointment-types', AppointmentTypeController::class);
Route::resource('health-conditions', HealthConditionController::class);
Route::resource('prescriptions', PrescriptionController::class);
Route::resource('childrens', ChildrenController::class);
Route::resource('clinic', ClinicController::class);
Route::resource('diagnosis', DiagnosisController::class);
Route::resource('walk-ins-appointments', WalkInAppointmentController::class);
Route::resource('outpatients', OutpatientController::class);
Route::resource('doctors', DoctorController::class);

Route::get('/immunization/child/{child}', [ImmunizationController::class, 'getChildImmunizationsByName']);

// Appoinments
Route::get('/appointment/approved', [AppointmentController::class, 'getApprovedAppointments']);
Route::get('/appointment/parent/{parent_id}', [AppointmentController::class, 'getUserAppointments']);
Route::put('/appointment/{id}/remarks', [AppointmentController::class, 'updateRemarks']);
Route::put('/appointment/{id}/status', [AppointmentController::class, 'updateStatus']);
Route::put('/appointment/priority-queue', [AppointmentController::class, 'updatePriorityQueue']);
Route::get('/appointment/user-appointments/{user_id}/today', [AppointmentController::class, 'getUserAppointmentsByDate']);
Route::get('/appointment/today', [AppointmentController::class, 'getTodayAppointments']);
Route::get('/appointment/requests', [AppointmentController::class, 'getAppointmentRequests']);
Route::get('/appointment/total', [AppointmentController::class, 'getTotalAppointments']);

Route::get('/walk-ins-appointment/date', [WalkInAppointmentController::class, 'filterWalkInAppointmentsByDate']);
Route::get('/walk-in-appointment/history/{parent?}/{child?}', [WalkInAppointmentController::class, 'getAppointmentHistory']);

Route::get('/prescription/parent/{parent_id}', [PrescriptionController::class, 'getUserPrescriptions']);
Route::post('/prescriptions-medications', [PrescriptionController::class, 'storeMedication']);
Route::put('/prescriptions-medications/{id}', [PrescriptionController::class, 'updateMedication']);
Route::delete('/prescription-medications/{id}', [PrescriptionController::class, 'destroyMedication']);
Route::get('/prescriptions-medications/{id}', [PrescriptionController::class, 'showMedication']);
Route::get('/prescription/child/{child_id}', [PrescriptionController::class, 'showByChildId']);
Route::get('/prescription/parent/{parent}/child/{child}/type/{type}', [PrescriptionController::class, 'getPrescriptionsByParentAndChild']);
Route::get('/prescription/walkins', [PrescriptionController::class, 'listPrescriptionForWalkins']);
Route::get('/prescription/online', [PrescriptionController::class, 'listPrescriptionForOnline']);

Route::get('/outpatient/distinct-parents', [OutpatientController::class, 'distinctParents']);
Route::get('/outpatient/children-by-parent/{parent}', [OutpatientController::class, 'childrenByParent']);
Route::get('/all-childrens', [OutpatientController::class, 'allChildren']);
Route::get('/children/total', [ChildrenController::class, 'getTotalChildrenCount']);
Route::get('/children/{id}/details', [ChildrenController::class, 'showChildDetails']);

Route::get('/outpatient/parent/{parent}', [OutpatientController::class, 'getDetailsByParent']);
Route::get('/outpatient/parent/{parent}/child/{child}', [OutpatientController::class, 'getDetailsByChildAndParent']);

Route::get('/appointment/count-by-month', [AppointmentController::class, 'countAppointmentsByMonth']);
Route::get('/appointment/count-health-conditions-and-immunizations', [AppointmentController::class, 'countHealthConditionsAndImmunizations']);

Route::get('/diagnoses/parent/{parent}/child/{child}/type/{type}', [DiagnosisController::class, 'getDiagnosisByParentAndChild']);
Route::get('/diagnoses/walkins', [DiagnosisController::class, 'listDiagnosesForWalkins']);
Route::get('/diagnoses/online', [DiagnosisController::class, 'listDiagnosesForOnline']);

Route::get('/patient/{id}', [PatientController::class, 'show_patient']);

Route::get('/get-vaccines', [VaccineController::class, 'get_vaccines']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
