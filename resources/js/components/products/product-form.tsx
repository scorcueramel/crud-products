import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { index, store, update } from "@/routes/products";

import type { Product } from "@/types/product";
import { useForm } from "@inertiajs/react";
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
    return(
      <form onSubmit={submit} className="max-w-2xl space-y-">

      </form>
    );
}
