<?php
if (empty($_GET['files'])) // 1
{
    die('/* błąd ładowania plików */');
}

require_once 'js/jsmin.php';
require_once 'js/jscacher.php';

$cacher = new JSCacher();
die($cacher->minimize($_GET['files']));
