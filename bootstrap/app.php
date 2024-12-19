<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Tambahkan middleware grup di sini
        $middleware->getMiddlewareGroups([
            'web' => [
                // Tambahkan middleware grup 'web' jika diperlukan
            ],
            'api' => [
                // Tambahkan middleware grup 'api' jika diperlukan
            ],
            'swagger' => [
                \L5Swagger\Http\Middleware\Config::class,
            ],
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();