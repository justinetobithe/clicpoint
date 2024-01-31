<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Prescription</title>
</head>

<style>
    body {
        font-family: Arial, sans-serif;
    }

    .header {
        text-align: center;
        margin-top: 20px;
    }

    .clinic-info {
        width: 50%;
        float: left;
    }

    .clinic-hours {
        width: 50%;
        float: right;
        text-align: right;
    }

    .divider {
        border: 1px solid black;
        margin-top: 70px;
    }

    .patient-info {
        text-align: center;
        margin-top: 20px;
        font-size: 13px;
    }

    .rx-symbol {
        display: inline;
        margin-left: 10px;
    }

    .medication-header {
        margin-top: 20px;
        font-size: 15px;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
    }

    .medication-list {
        margin-top: 20px;
        font-size: 13px;
        text-align: center;
    }

    .list-group {
        list-style: none;
        padding: 0;
        margin: 0;
        display: inline-block;
    }

    .list-group-item {
        padding: 8px;
        margin-top: -1px;
        position: relative;
        text-align: left;
    }
</style>

<body>
    <div class="row" style="text-align: center;">
        <div style="display: inline-block; text-align: center;">
            <p style="font-size: 15px; text-transform: uppercase; font-weight: bold; margin-bottom: 0; text-transform: uppercase;">Rachel Tranquilan-Preguit, MD</p>
            <p style="font-size: 12px; font-weight: regular; text-transform: uppercase;">Fellow, Philippine Pediatric Society</p>
        </div>
    </div>

    <div class="row" style="margin-top: -40px;">
        <div style="display: inline-block; text-align: left; width: 50%; float: left;">
            <p style="font-size: 11px; text-transform: uppercase; margin-bottom: 0;">Clinic Address</p>
            <p style="font-size: 15px; font-weight: bold; font-style: italic; margin-bottom: 0;">Peguit Pediatric Clinic</p>
            <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 0;">National Highway, Madua, Tandag City</p>
        </div>

        <div style="display: inline-block; text-align: right; width: 50%; float: right;">
            <p style="font-size: 11px; text-transform: uppercase; margin-bottom: 0;">Clinic Hours:</p>
            <p style="font-size: 15px; font-weight: bold; margin-bottom: 0;">Monday to Saturday</p>
            <p style="font-size: 11px; font-weight: bold; margin-bottom: 0;">9:00 am - 12:00 nn / 2:00 pm - 5:00 pm</p>
        </div>
    </div>

    <hr style="border: 1px solid black; margin-top: 70;">

    <div class="row" style="text-align: center; margin-top: 20px; font-size: 13px; ">
        <img src="{{ public_path('/img/rx-symbol.png') }}" width="50" height="50" class="rx-symbol">
        <p style="display: inline; margin-left: 10px;">
            <span style="width: 250px; display: inline-block;">
                Child / Patient: <u>{{ $prescription->children->name ?? $prescription->child }}</u>
            </span>
            <span style="width: 100; display: inline-block;">
                Weight: <u>{{ $prescription->weight ? $prescription->weight . ' kg' : '' }}</u>
            </span>
            <span style="width: 50; display: inline-block;">
                Age: <u>{{ is_object($prescription->child) ? \Carbon\Carbon::parse($prescription->child->date_of_birth)->age : '' }}</u>
            </span>
            <span style="width: 150px; display: inline-block;">
                Date: <u>{{ \Carbon\Carbon::parse($prescription->created_at)->format('Y-m-d') }}</u>
            </span>
        </p>
    </div>

    <div class="row">
        <p style="font-size: 15px; font-weight: bold; text-transform: uppercase; margin-bottom: 0;">Medication</p>
    </div>

    <div class="medication-list">
        @foreach ($prescription->prescription_medications as $index => $medication)
        <div>
            <ul class="list-group">
                <li class="list-group-item">{{ $index + 1 }}. {{ $medication->details }}</li>
                <li class="list-group-item">Sig: {{ $medication->taken }}</li>
                @if($medication->remarks)
                <li class="list-group-item" style="font-style: italic;">Remarks: {{ $medication->remarks }}</li>
                @endif
            </ul>
        </div>
        @endforeach
    </div>

    <div style="float: right; margin-top: 20px; font-size: 13px;">
        <u>{{ $prescription->doctor->user->name }}</u>, M.D<br>
        Lic. No.: {{ $prescription->doctor->license_number }}<br>
        PTR No.: {{ $prescription->doctor->ptr_number }}<br>
        S2 No.: _____________<br>
    </div>
</body>

</html>