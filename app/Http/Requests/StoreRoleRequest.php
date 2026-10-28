<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class StoreRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', Role::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:125',
                Rule::unique('roles', 'name')->where('guard_name', 'web')
            ],
            'permissions' => [
                'present',
                'array',
            ],
            [
                'permissions.*' => [
                    'required',
                    'string',
                    'distinct',
                    Rule::exists('permissions', 'name')->where('guard_name', 'web')
                ]
            ]
        ];
    }
}
