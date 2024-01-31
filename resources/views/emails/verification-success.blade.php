<!DOCTYPE html>
<html>

<head>
    <title>Email Verification Success</title>
</head>

<body>
    <p>{{ $message }}</p>
    <script>
        setTimeout(function() {
            window.location.href = '/';
        }, 3000);
    </script>
</body>

</html>