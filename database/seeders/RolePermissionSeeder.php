<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $modules = ['products', 'users', 'roles'];
        $actions = ['view', 'create', 'update', 'delete'];

        $permissions = [];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $name = "{$module}.{$action}";
                Permission::findOrCreate($name, 'web');
                $permissions[] = $name;
            }
        }

        Role::findOrCreate('admin', 'web')->syncPermissions($permissions);
        Role::findOrCreate('manager', 'web')->syncPermissions([
            'products.view',
            'products.create',
            'products.update',
            'products.delete'
        ]);
        Role::findOrCreate('viewer', 'web')->syncPermissions(['products.view']);
    }
}
