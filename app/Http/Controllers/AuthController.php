<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Fungsi untuk register
    public function register(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|string|max:50', // Menambahkan validasi untuk role
            'phone' => 'nullable|string|max:15', 
            'address' => 'nullable|string|max:255',
            'age' => 'nullable|integer|min:0|max:150',
            'gender' => 'nullable|string|in:Male,Female,Other',
        ]);
    
        // Jika validasi gagal, return error
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        // Buat user baru dengan atribut tambahan
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user', // Default role 'user'
            'phone' => $request->phone,
            'address' => $request->address,
            'age' => $request->age, // Mengambil nilai dari request
            'gender' => $request->gender, // Mengambil nilai dari request
        ]);
        
        $this->reIndexUsers();
    
        // Return response sukses
        return response()->json(['message' => 'User registered successfully'], 201);
    }
    

    // Fungsi untuk login
    public function login(Request $request)
    {
        // Validasi input login
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        // Jika validasi gagal, return error
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        // Cek apakah user ada
        $user = User::where('email', $request->email)->first();
    
        // Jika user tidak ada atau password salah
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        // Buat token untuk user yang login
        $token = $user->createToken('auth_token')->plainTextToken;
    
        // Return token dan role sebagai response
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    

    // Fungsi untuk logout
    public function logout(Request $request)
    {
        // Hapus token yang aktif
        $request->user()->currentAccessToken()->delete();

        // Return response sukses
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    private function reIndexUsers()
    {
        // Ambil semua pengguna dengan ID terurut
        $users = User::orderBy('id')->get();

        // Perbarui ID pengguna secara berurutan
        $users->each(function ($user, $index) {
            $user->id = $index + 1; // Mulai ID dari 1
            $user->save();
        });
    }
}
