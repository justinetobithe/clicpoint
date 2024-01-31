<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
</head>

<body>
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0; text-align: center; background-color: #1982c4; color: #fff;">
                <h1>Password Reset</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p>Hello {{ $user->name }},</p>
                <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
                <p style="text-align: center;"><a href="{{ $verificationLink }}" style="display: inline-block; padding: 10px 20px; background-color: #1982c4; color: #fff; text-decoration: none;">Reset Password</a></p>
                <p>If you did make this request, click the button above to reset your password. Please note that the link is only valid for a limited time.</p>
                <p>If you have any questions, feel free to contact our support team.</p>
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