<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') && $user->can('roles.view');
    }

    public function view(User $user): bool
    {
        return $user->hasRole('admin') && $user->can('roles.view');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') && $user->can('roles.create');
    }

    public function update(User $user, Role $role): bool
    {
        return $role->name !== 'admin' && $user->hasRole('admin') && $user->can('roles.update');
    }

    public function delete(User $user, Role $role): bool
    {
        return $role->name !== 'admin' && $user->hasRole('admin') && $user->can('roles.delete');
    }
}
