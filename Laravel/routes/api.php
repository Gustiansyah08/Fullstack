<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\CorsMiddleware; // Pastikan ini di-import


// Rute untuk register dan login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Menangani preflight request (OPTIONS) untuk semua rute
Route::options('/{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

// Rute yang dilindungi oleh Sanctum dan menggunakan CORS
Route::middleware([CorsMiddleware::class, 'auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::get('/user', function (Request $request) {return $request->user(); });

    Route::apiResource('/users', UserController::class);

    Route::post('/logout', [AuthController::class, 'logout']);
});
