import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

import {
    create,
    destroy,
    edit,
    index,
} from '@/routes/products';

import type {
    PaginatedProducts,
    Product,
    ProductPermissions,
} from '@/types/product';

interface Props {
    products: PaginatedProducts;
    filters: {
        search: string;
    };
    permissions: ProductPermissions;
    flash: {
        success: string | null;
    };
}

export default function ProductsIndex({
    products,
    filters,
    permissions,
    flash,
}: Props) {
    const [search, setSearch] = useState(filters.search);

    function submitSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        router.get(
            index().url,
            search.trim() ? { search: search.trim() } : {},
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    function remove(product: Product) {
        if (!window.confirm(
            `¿Eliminar el producto "${product.name}"?`
        )) {
            return;
        }

        router.delete(destroy(product.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Productos', href: index().url },
            ]}
        >
            <Head title="Productos" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">
                        Productos
                    </h1>

                    {permissions.create && (
                        <Button asChild>
                            <Link href={create().url}>
                                Nuevo producto
                            </Link>
                        </Button>
                    )}
                </div>

                {flash?.success && (
                    <div
                        role="status"
                        className="rounded-md border p-3 text-sm"
                    >
                        {flash.success}
                    </div>
                )}

                <form
                    onSubmit={submitSearch}
                    className="flex max-w-lg gap-2"
                >
                    <Input
                        placeholder="Buscar nombre o SKU..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        maxLength={100}
                    />

                    <Button type="submit">
                        Buscar
                    </Button>
                </form>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr className="border-b text-left">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">SKU</th>
                                <th className="p-3">Precio</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.data.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b"
                                >
                                    <td className="p-3">
                                        {product.name}
                                    </td>

                                    <td className="p-3">
                                        {product.sku}
                                    </td>

                                    <td className="p-3">
                                        {product.price}
                                    </td>

                                    <td className="p-3">
                                        {product.stock}
                                    </td>

                                    <td className="p-3">
                                        {product.is_active
                                            ? 'Activo'
                                            : 'Inactivo'}
                                    </td>

                                    <td className="space-x-2 p-3">
                                        {permissions.update && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={edit(product.id).url}
                                                >
                                                    Editar
                                                </Link>
                                            </Button>
                                        )}

                                        {permissions.delete && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    remove(product)
                                                }
                                            >
                                                Eliminar
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {products.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-6 text-center"
                                    >
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                        Página {products.current_page} de{' '}
                        {products.last_page} —{' '}
                        {products.total} registros
                    </span>

                    <div className="flex gap-2">
                        {products.prev_page_url && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={products.prev_page_url}>
                                    Anterior
                                </Link>
                            </Button>
                        )}

                        {products.next_page_url && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={products.next_page_url}>
                                    Siguiente
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}