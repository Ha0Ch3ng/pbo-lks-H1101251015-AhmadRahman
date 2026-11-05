<?php

/**
 * Front Controller — satu-satunya file yang diakses dari browser.
 * Semua request masuk lewat sini, lalu diarahkan ke Controller.
 */
require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Env;
use App\Controllers\BookController;
use App\Contracts\BookRepositoryInterface;
use App\Core\Container;
use App\Core\Request;
use App\Core\Response;
use App\Core\Router;
use App\Database\Connection;
use App\Repositories\MySQLBookRepository;
use App\Services\BookService;
// ============ 1. Load konfigurasi ============
Env::load(__DIR__ . '/../.env');
// ============ 2. Setup Dependency Container ============
$container = new Container();
$container->singleton(PDO::class, fn() => Connection::get());
$container->bind(
    BookRepositoryInterface::class,
    fn(Container $c) => new MySQLBookRepository($c->make(PDO::class))
);
$container->bind(
    BookService::class,
    fn(Container $c) => new BookService(
        $c->make(BookRepositoryInterface::class)
    )
);
$container->bind(
    BookController::class,
    fn(Container $c) => new BookController(
        $c->make(BookService::class)
    )
);
// ============ 3. Daftarkan route ============
$router = new Router();
$controller = $container->make(BookController::class);
$router->get('/api/books', [$controller, 'index']);
$router->get('/api/books/{id}', [$controller, 'show']);
$router->post('/api/books', [$controller, 'store']);
$router->put('/api/books/{id}', [$controller, 'update']);
$router->delete('/api/books/{id}', [$controller, 'destroy']);
// ============ 4. Dispatch request ============
try {
    $router->dispatch(new Request());
} catch (\Throwable $e) {
    Response::error('Server Error: ' . $e->getMessage(), 500);
}
