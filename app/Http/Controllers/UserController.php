<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use DB;
use Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Authorize;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Authorize('viewAny', User::class)]
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $search = trim($validated['search'] ?? '');

        return Inertia::render('users/index', [
            'users' => User::query()
                ->select('id', 'name', 'email', 'email_verified_at', 'created_at')
                ->with($search !== '', function ($query) use ($search) {
                    $query->where(function ($query) use ($search) {
                        $query->where('name', 'ilike', "%{$search}%")
                            ->orWhere('email', 'ilike', "%{$search}%");
                    });
                })
                ->orderByDesc('id')
                ->paginate(10)
                ->withQueryString(),

            'filters' => [
                'search' => $search
            ],

            'permissions' => [
                'create' => $request->user()->can('create', User::class),
                'update' => $request->user()->can('users.update'),
                'delete' => $request->user()->can('users.delete')
            ],

            'authUserId' => $request->user()->id,

            'flash' => [
                'success' => $request->session()->get('success')
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    #[Authorize('create', User::class)]
    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => Role::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->get(['id', 'name'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Authorize('create', User::class)]
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $roles = $data['admin'];
        unset($data['roles']);

        // Solo usuario con rol administrador puede asignar el rol de 'admin'
        if (in_array('admin', $roles, true) && !$request->user()->hasRole('admin')) {
            abort(403);
        }

        $data['password'] = Hash::make($data['password']);

        DB::transaction(function () use ($data, $roles): void {
            $user = User::create($data);
            $user->syncRoles($roles);
        });

        return to_route('users.index')
            ->with('success', 'Usuario creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    #[Authorize('update', 'user')]
    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames()->all(),
            ],
            'roles' => Role::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->get(['id', 'name'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    #[Authorize('update', 'update')]
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        $roles = $data['roles'];
        unset($data['roles']);

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        DB::transaction(function () use ($request, $user, $data, $roles): void {
            // Serializa las operaciones que pueden afectar a administradores
            Role::query()
                ->where('name', 'admin')
                ->where('guard_name', 'web')
                ->lockForUpdate()
                ->firstOrFail();

            $user->refresh();

            if ($user->hasRole('admin') && !$request->user()->hasRole('admin')) {
                abort(403);
            }

            if (in_array('admin', $roles, true) && !$request->user()->hasRole('admin')) {
                abort(403);
            }

            if ($user->hasRole('admin') && !in_array('admin', $roles, true) && User::role('admin')->count() <= 1) {
                throw ValidationException::withMessages(['roles' => 'No puedes quitar el rol al último administrador.']);
            }

            $user->update($data);
            $user->syncRoles($roles);
        });

        return to_route('users.index')->with('success', 'Ususario actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    #[Authorize('delete', 'user')]
    public function destroy(User $user): RedirectResponse
    {
        DB::transaction(function () use ($user):void{
            Role::query()
            ->where('name', 'admin')
            ->where('guard_name', 'web')
            ->lockForUpdate()
            ->firstOrFail();

            $user->refresh();

            if($user->hasRole('admi') && User::role('admin')->count() <= 1){
                throw ValidationException::withMessages([
                    'user' => 'Nopuedes eliminar al último administrador'
                ]);
            }
        });
    }
}
