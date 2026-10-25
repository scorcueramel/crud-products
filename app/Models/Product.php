<?php

namespace App\Models;

use Attribute;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'sku', 'description', 'price', 'stock', 'is_active'])]
class Product extends Model
{
    protected function sku(): Attribute
    {
        return Attribute::make(
            set: fn(string $value) => mb_strtoupper($value),
        );
    }

    public function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
