<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Laravel Sanctum dengan Swagger",
 *      description="Angling Gustiansyah G.211.22.0017",
 *      @OA\Contact(
 *          email="email@example.com"
 *      ),
 *      @OA\License(
 *          name="Apache 2.0",
 *          url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *      )
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 * 
 * @OA\Components(
 *     @OA\Schema(
 *         schema="User",
 *         type="object",
 *         required={"name", "email", "password"},
 *         @OA\Property(property="id", type="integer"),
 *         @OA\Property(property="name", type="string"),
 *         @OA\Property(property="email", type="string"),
 *         @OA\Property(property="password", type="string"),
 *         @OA\Property(property="role", type="string"),
 *         @OA\Property(property="phone", type="string"),
 *         @OA\Property(property="address", type="string"),
 *         @OA\Property(property="age", type="integer"),
 *         @OA\Property(property="gender", type="string")
 *     )
 * )
 */

class UserController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="Dapatkan daftar semua pengguna beserta hasil survei mereka",
     *     description="Mengembalikan daftar semua pengguna beserta survei mereka",
     *     operationId="getUsers",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}}, 
     *     @OA\Response(
     *         response=200,
     *         description="Daftar pengguna beserta data mereka",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", description="ID pengguna"),
     *                 @OA\Property(property="name", type="string", description="Nama pengguna"),
     *                 @OA\Property(property="email", type="string", description="Email pengguna"),
     *                 @OA\Property(property="role", type="string", description="Role pengguna"),
     *                 @OA\Property(property="phone", type="string", description="Nomor telepon pengguna"),
     *                 @OA\Property(property="address", type="string", description="Alamat pengguna"),
     *                 @OA\Property(property="age", type="integer", description="Usia pengguna"),
     *                 @OA\Property(property="gender", type="string", description="Jenis kelamin pengguna")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Pengguna tidak ditemukan"
     *     )
     * )
     */
    
    public function index()
    {
        return response()->json(User::all());
    }

    /**
     * @OA\Post(
     *     path="/api/users",
     *     summary="Tambah pengguna baru",
     *     description="Menyimpan pengguna baru",
     *     operationId="createUser",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}}, 
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"name", "email", "password"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="role", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="address", type="string"),
     *             @OA\Property(property="age", type="integer"),
     *             @OA\Property(property="gender", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Pengguna berhasil dibuat",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     )
     * )
     */
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string|max:10',
        ]);
    
        // Membuat user baru dengan atribut tambahan
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role ?? 'user',
            'phone' => $request->phone,
            'address' => $request->address,
            'age' => $request->age,
            'gender' => $request->gender,
        ]);
    
        // Memastikan ID urut setelah penambahan
        $this->reIndexUsers();
    
        return response()->json($user, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/users/{id}",
     *     summary="Dapatkan pengguna berdasarkan ID",
     *     description="Mengembalikan pengguna berdasarkan ID",
     *     operationId="getUserById",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}}, 
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detail pengguna",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Pengguna tidak ditemukan"
     *     )
     * )
     */
    public function show(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Pengguna tidak ditemukan'
            ], 404);
        }

        return response()->json($user);
    }

    /**
     * @OA\Put(
     *     path="/api/users/{id}",
     *     summary="Perbarui pengguna",
     *     description="Memperbarui data pengguna berdasarkan ID",
     *     operationId="updateUser",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}}, 
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"name", "email", "password"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="role", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="address", type="string"),
     *             @OA\Property(property="age", type="integer"),
     *             @OA\Property(property="gender", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Pengguna berhasil diperbarui",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'nullable|string|max:50', 
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string|max:10',
        ]);

        // Pembaruan data pengguna
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
            'role' => $request->role ?? $user->role,
            'phone' => $request->phone,
            'address' => $request->address,
            'age' => $request->age,
            'gender' => $request->gender,
        ]);

        return response()->json($user);
    }
/**
 * @OA\Delete(
 *     path="/api/users/{id}",
 *     summary="Hapus pengguna berdasarkan ID",
 *     description="Menghapus pengguna berdasarkan ID",
 *     operationId="deleteUser",
 *     tags={"Users"},
 *     security={{"bearerAuth":{}}}, 
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="string")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Pengguna berhasil dihapus"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Pengguna tidak ditemukan"
 *     )
 * )
 */
public function destroy(string $id)
{
    // Cari pengguna berdasarkan ID
    $user = User::find($id);

    // Jika pengguna tidak ditemukan, kirimkan respons 404
    if (!$user) {
        return response()->json([
            'message' => 'Pengguna tidak ditemukan'
        ], 404);
    }

    // Hapus pengguna
    $user->delete();

    // Menyusun ulang ID pengguna agar berurutan
    $this->reIndexUsers();

    return response()->json([
        'message' => 'Pengguna berhasil dihapus dan ID lainnya diperbarui.'
    ]);
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