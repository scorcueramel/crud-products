<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Authorize;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Authorize('viewAny', Product::class)]
    public function index(Request $request): Response
    {
        return Inertia::render('products/index', [
            'products' => Product::query()
                ->orderByDesc('id')
                ->paginate(10)
                ->withQueryString(),

            'permissions' => [
                'create' => $request->user()->can('create', Product::class),
                'update' => $request->user()->can('products.update'),
                'delete' => $request->user()->can('products.delete'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    #[Authorize('create', Product::class)]
    public function create(): Response
    {
        return Inertia::render('products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Authorize('create', Product::class)]
    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::create($request->validated());
        return to_route('products.index')->with('success', 'Producto creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    #[Authorize('update', 'product')]
    public function edit(Product $product): Response
    {
        return Inertia::render('products/edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    #[Authorize('update', 'product')]
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());
        return to_route('products.index')->with('success', 'Producto actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    #[Authorize('delete','product')]
    public function destroy(Product $product): RedirectResponse
    {
        return to_route('products.index')->with('success', 'Producto eliminado correctamente');
    }
}
