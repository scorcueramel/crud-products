<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Authorize;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Authorize('viewAny', Role::class)]
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100']
        ]);

        $search = trim($validated['search'] ?? '');

        return Inertia::render('roles/index', [
            'roles' => Role::query()
                ->where('guard_name', 'web')
                ->with('permissions:id,name')
                ->when($search != '', function ($query) use ($search) {
                    $query->where('name', 'ilike', "%{$search}%");
                })
                ->orderBy('name')
                ->paginate(10)
                ->through(fn(Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $role->permissions->pluck('name')->all(),
                    'can_update' => $request->user()->can('update', $role),
                    'can_delete' => $request->user()->can('delete', $role)
                ])
                ->withQueryString(),

            'filters' => [
                'search' => $search
            ],

            'canCreate' => $request->user()->can('create', Role::class),
            'flash' => [
                'success' => $request->session()->get('success')
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    #[Authorize('create', Role::class)]
    public function create(): Response
    {
        return Inertia::render('roles/create', [
            'permissions' => Permission::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->get(['id', 'name'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Authorize('create', Role::class)]
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data): void {
            $role = Role::create([
                'name' => $data['name'],
                'guard_name' => 'web'
            ]);
            $role->syncPermissions($data['permissions']);
        });

        return to_route('roles.index')->with('success', 'Rol creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    #[Authorize('update', 'role')]
    public function edit(Role $role): Response
    {
        return Inertia::render('roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->all()
            ],
            'permissions' => Permission::query()->where('guard_name', 'web')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
