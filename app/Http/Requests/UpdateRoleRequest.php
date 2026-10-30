<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $role = $this->route('role');

        return $role instanceof Role
            && ($this->user()?->can('update', $role) ?? false);
    }

    public function rules(): array
    {
        $role = $this->route('role');
        $isReserved = $role instanceof Role && in_array($role->name, ['manager', 'viewer'], true);

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:125',
                Rule::unique('roles', 'name')
                    ->where('guard_name', 'web')
                    ->ignore($role),
                ...($isReserved ? [Rule::in([$role->name])] : [])
            ],

            'permissions' => [
                'present',
                'array',
            ],

            'permissions.*' => [
                'required',
                'string',
                'distinct',
                Rule::exists('permissions', 'name')
                    ->where('guard_name', 'web'),
            ],
        ];
    }
}
