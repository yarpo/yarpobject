<?php
define('EXPIRES_IN_2_MINUTES', time()+60*2);
$data = '<data>
			<imie>'. $_GET['imie'] .'</imie>
			<nazwisko>'. $_GET['nazwisko'] .'</nazwisko>
		</data>';

setcookie('yXMLHttpCookieRequest', $data, EXPIRES_IN_2_MINUTES);
echo $data;
