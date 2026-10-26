import { Head } from '@inertiajs/react';

import ProductForm from '@/components/products/product-form';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/products'

export default function CreateProduct() {
  const breadcrumbs = [
    {
      title: 'Products', 
      href: index().url,
    },
    {
      title: 'Crear',
      href: '#'
    }
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear producto"/>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Crear producto</h1>
        <ProductForm />
      </div>
    </AppLayout>
  );
}