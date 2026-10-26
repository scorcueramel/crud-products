import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { index, store, update } from "@/routes/products";

import type { Product } from "@/types/product";
import { Link, useForm } from "@inertiajs/react";
import { FormEvent } from "react";

interface Props {
    product?: Product;
}

export default function ProductForm({ product }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name ?? "",
        sku: product?.sku ?? "",
        description: product?.description ?? "",
        price: product?.price ?? "",
        stock: product?.stock ?? 0,
        is_active: product?.is_active ?? true,
    });
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (product) {
            put(update(product.id).url);
        } else {
            post(store().url);
        }
    }
    return (
        <form onSubmit={submit} className="max-w-2xl space-y-">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    maxLength={150}
                    required
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                    id="sku"
                    value={data.sku}
                    onChange={(e) => setData("sku", e.target.value)}
                    maxLength={50}
                    required
                />
                {errors.sku && (
                    <p className="text-sm text-destructive">{errors.sku}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows={4}
                    className="w-full rounded-md border bg-background p-3 text-sm"
                />
                {errors.description && (
                    <p className="text-sm text-destructive">
                        {errors.description}
                    </p>
                )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 mb-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.price}
                    onChange={(e) => setData("price", e.target.value)}
                    required
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={data.stock}
                    onChange={(e) => setData("stock", Number(e.target.value))}
                    required
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive">
                      {errors.stock}
                    </p>
                  )}
                </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
                <Checkbox
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(value) =>
                        setData("is_active", value === true)
                    }
                    className="cursor-pointer"
                />

                <Label htmlFor="is_active" className="cursor-pointer">Producto activo</Label>
            </div>

            {errors.is_active && (
                <p className="text-sm text-destructive">
                    {errors.is_active}
                </p>
            )}

            <div className="flex gap-3">
                <Button type="submit" disabled={processing} className="cursor-pointer">
                    {processing
                        ? "Guardando..."
                        : product
                          ? "Actualizar producto"
                          : "Crear producto"}
                </Button>

                <Button variant="outline" asChild>
                    <Link href={index().url}>Cancelar</Link>
                </Button>
            </div>
        </form>
    );
}
