
<?php
require 'vendor/autoload.php';

use App\Core\Container;

$container = new Container();

// Menguji bind()
$container->bind('contoh', function ($container) {
    return 'Container berhasil!';
});

// Menguji make()
$hasil = $container->make('contoh');

echo $hasil . PHP_EOL;
