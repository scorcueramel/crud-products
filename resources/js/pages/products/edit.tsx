import { Head } from '@inertiajs/react';

import ProductForm from '@/components/products/product-form';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/products';

import type { Product } from '@/types/product';

interface Props {
    product: Product;
}

export default function EditProduct({ product }: Props) {
    return (
        <>
            <Head title="Editar producto" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    Editar producto
                </h1>

                <ProductForm product={product} />
            </div>
        </>
    );
}

EditProduct.layout = {
    breadcrumbs: [
        {
            title: "Products",
            href: index().url,
        },
        {
            title: "Editar",
            href: "#",
        },
    ],
};