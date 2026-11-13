<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users with search and pagination.
     */
    public function index(Request $request): Response
    {
        $query = User::query()
            ->withCount('quotes')
            ->orderBy('id', 'asc');

        if ($search = $request->input('search')) {
            $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

            $query->where(function ($q) use ($search, $like) {
                $q->where('name', $like, "%{$search}%")
                    ->orWhere('email', $like, "%{$search}%")
                    ->orWhere('role', $like, "%{$search}%");
            });
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        return redirect()->route('users.index')
            ->with('success', "Usuario {$user->name} creado exitosamente.");
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();
        $currentUserId = $request->user()?->id ?? auth()->id();

        // Blindaje: El admin autenticado no puede despojarse a sí mismo de su rol de admin
        if ($user->id === $currentUserId && $validated['role'] !== User::ROLE_ADMIN) {
            return back()->with('error', 'No puedes quitarte el rol de Administrador a ti mismo.');
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('users.index')
            ->with('success', "Usuario {$user->name} actualizado exitosamente.");
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $currentUserId = $request->user()?->id ?? auth()->id();

        // Blindaje: El admin no puede eliminarse a sí mismo
        if ($user->id === $currentUserId) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta de usuario.');
        }

        // Blindaje: No eliminar usuarios con cotizaciones registradas para proteger la trazabilidad comercial
        if ($user->quotes()->exists()) {
            return back()->with('error', "No es posible eliminar al usuario {$user->name} porque tiene cotizaciones asociadas en el sistema.");
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', "Usuario {$userName} eliminado exitosamente.");
    }
}
