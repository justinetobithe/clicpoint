<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Email Verification</title>
</head>

<body>
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0; text-align: center; background-color: #1982c4; color: #fff;">
                <h1>Email Verification</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p>Hello {{ $user->name }},</p>
                <p>Thank you for choosing Clicpoint Clinic! To ensure the security of your account and manage your clinic appointments, please verify your email address by clicking the button below:</p>
                <p style="text-align: center;"><a href="{{ $verificationLink }}" style="display: inline-block; padding: 10px 20px; background-color: #1982c4; color: #fff; text-decoration: none;">Verify Email</a></p>
                <p>If you did not create an account or did not request this verification, you can ignore this email. Your account will remain inactive until verified.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f2f2f2;">
                <p>&copy; {{ date('Y') }} Clicpoint Clinic. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>

</html>