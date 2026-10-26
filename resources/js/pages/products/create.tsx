import { Head } from "@inertiajs/react";

import ProductForm from "@/components/products/product-form";
import { index } from "@/routes/products";

export default function CreateProduct() {
    return (
        <>
            <Head title="Crear producto" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Crear producto</h1>
                <ProductForm />
            </div>
        </>
    );
}

CreateProduct.layout = {
    breadcrumbs: [
        {
            title: "Products",
            href: index().url,
        },
        {
            title: "Crear",
            href: "#",
        },
    ],
};
