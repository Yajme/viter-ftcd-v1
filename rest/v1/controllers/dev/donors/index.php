<?php

 require_once __DIR__ . '/../../../core/bootstrap.php';


   dispatchResource([
       'POST' => __DIR__ . '/create.php',
       'POST:start' => __DIR__ . '/page.php',
       'GET' => __DIR__ . '/read.php',
       'PUT' => __DIR__ . '/update.php',
       'PUT:archive' => __DIR__ . '/active.php',
       'DELETE' => __DIR__ . '/delete.php',
   ]);
