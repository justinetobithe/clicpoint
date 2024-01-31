<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Diagnosis</title>
</head>

<style>
    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    td,
    th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
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

    <!-- Details table starts here -->
    <table class="table table-bordered" style="color: #000; font-size: 13px; width: 100%;">
        <tr>
            <th>Name</th>
            <td>{{ $name }}</td>
            <th>Sex</th>
            <td>{{ $child ? $child->gender : '' }}</td>
        </tr>
        <tr>
            <th>Age</th>
            <td>
                <?php
                echo ($child && $child->date_of_birth) ? (
                    ($age = calculateAge($child->date_of_birth)) ? $age : 'N/A'
                ) : '';
                ?>
            </td>
            <th>Birthdate</th>
            <td>{{ $child ? date('F j, Y', strtotime($child->date_of_birth)) : '' }}</td>
        </tr>
        <tr>
            <th>Address</th>
            <td>{{ $child ? $child->place_of_birth : '' }}</td>
            <th>Contact Details</th>
            <td>{{ $child && $child->user ? $child->user->email : '' }}</td>
        </tr>
        <tr>
            <th>Father's Name</th>
            <td>
                @if ($child && $child->relationship === 'Father' && $child->user)
                {{ $child->user->name }}
                @endif
            </td>
            <th>Mother's Name</th>
            <td>
                @if ($child && $child->relationship === 'Mother' && $child->user)
                {{ $child->user->name }}
                @endif
            </td>
        </tr>
    </table>

    <div style="margin-top: 20px;">
        <table class="table table-bordered" style="color: #000; font-size: 13px; width: 100%;">
            <thead style="background-color: #f0f0f0;">
                <tr>
                    <th scope="col" style="text-align: center; padding: 8px; text-transform: uppercase;" colspan="5">Follow-up visits</th>
                </tr>
                <tr>
                    <th scope="col" style="text-align: center; padding: 8px; text-transform: uppercase;">Date</th>
                    <th scope="col" style="text-align: center; padding: 8px; text-transform: uppercase;">Age</th>
                    <th scope="col" style="text-align: center; padding: 8px; text-transform: uppercase;">Weight</th>
                    <th scope="col" style="text-align: center; padding: 8px; text-transform: uppercase;">Height</th>
                    <th scope="col" style="text-align: center; padding: 8px; text-transform: uppercase;">Diagnosis and Physician's Notes/Directions</th>
                </tr>
            </thead>
            <tbody>
                @if ($diagnosis->isEmpty())
                <tr>
                    <td colspan="5">No diagnosis records found</td>
                </tr>
                @else
                @foreach ($diagnosis as $item)
                <tr>
                    <td>{{ $item ? date('F j, Y', strtotime($item->schedule)) : '' }}</td>
                    <td>{{ $item ? $item->age : '' }}</td>
                    <td>{{ $item ? $item->weight : '' }}</td>
                    <td>{{ $item ? $item->height : '' }}</td>
                    <td>{{ $item ? $item->notes : '' }}</td>
                </tr>
                @endforeach
                @endif
            </tbody>
        </table>
    </div>
</body>

</html>

<?php
function calculateAge($dateOfBirth)
{
    $birthdate = new DateTime($dateOfBirth);
    $currentDate = new DateTime();
    $age = $currentDate->diff($birthdate);

    if ($age->y < 1) {
        return $age->m . " months";
    } else {
        return $age->y . " yrs old";
    }
}
?>