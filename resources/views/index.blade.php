<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>ClicPoint</title>

    <!-- Custom fonts for this template-->
    <link href="{{ asset('/plugins/fontawesome-free/css/all.min.css') }}" rel="stylesheet" type="text/css"> 
   
    <link rel="icon" href="{{ asset('/img/logo-icon.png') }}" type="image/png" />   

    <!-- Custom styles for this template-->
    <link href="{{ asset('/css/style.css') }}" rel="stylesheet">

</head>

<body id="page-top">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="wrapper"></div>

    <script>
        const AUTH_USER = {!! $user->toJson() !!}
    </script>


    <script src="{{ asset('js/app.js') }}?v=<?php date('U') ?>"></script>

 
    <script src="{{ asset('/plugins/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
 
    <script src="{{ asset('/plugins/jquery-easing/jquery.easing.min.js') }}"></script>
 
    <script src="{{ asset('/js/main.js') }}"></script>


</body>

</html>