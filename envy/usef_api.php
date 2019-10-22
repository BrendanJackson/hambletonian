<?php
$clientid = 'bbc4529c908e4ea7acd29fc0c55a5aa4';
$clientsecret = '6d6270ac9db84ec5b43fa43cc01a523d';

$hash = hash_hmac('sha256', $clientid, $clientsecret, true);
$base64Str = base64_encode($hash);

$api_url = 'https://api.usef.org/api/shopusef/production/high-school-verification/' . $_GET['memid'];

$context = stream_context_create(array(
    'http' => array(
        'header' => "Authorization:" . $clientid . ':' . $base64Str,
    ),
));

$result = file_get_contents($api_url, false, $context);
echo $result;
?>