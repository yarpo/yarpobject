<?php
define('EXPIRES_IN_2_MINUTES', time()+60*2);
$data = $_GET['imie'] . ' ' . $_GET['nazwisko'];

setcookie('yXMLHttpCookieRequest', $data, EXPIRES_IN_2_MINUTES);
echo $data;
