"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductBody, type ProductView } from "@node-course/api-sdk";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
  useDeleteManyProducts,
  useUpdateManyProducts,
} from "@/lib/api-hooks.product";
import { clearToken, getId, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProductForm } from "@/components/product-form";
import ProductInList from "@/components/product-in-list";
import { GiftForm } from "@/components/gift-form";

type Editing = { mode: "create" } | { mode: "edit"; product: ProductView } | null;
type Gifting = { mode: "gift" } | null;

export default function ProductsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [editing, setEditing] = useState<Editing>(null);
  const [gifting, setGifting] = useState<Gifting>(null);
  const [onlyShowMine, setOnlyShowMine] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const productsQuery = useProducts(search, undefined, searchAddress);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const updateMany = useUpdateManyProducts();
  const deleteProduct = useDeleteProduct();
  const deleteMany = useDeleteManyProducts();

  
  const id = getId();

  if (!authChecked) return null;

  const logout = () => {
    clearToken();
    router.replace("/login");
  };


  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold mr-4">Products</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.replace("/fridges")}>
            Browse fridges
          </Button>
          <Button variant="secondary" onClick={() => router.replace("/recipes")}>
            Browse recipes
          </Button>
          <Button variant="secondary" onClick={() => router.replace("/users")}>
            Browse users
          </Button>
          <Button onClick={() => setEditing({ mode: "create" })}>
            New product
          </Button>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      <div className="flex gap-2 justify-between">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Search by fridge address..."
          value={searchAddress}
          onChange={(event) => setSearchAddress(event.target.value)}
          className="mb-4"
        />
      </div>


      <Card className="divide-y divide-slate-100">
        {productsQuery.isLoading && (
          <p className="p-4 text-sm text-slate-500">Loading…</p>
        )}
        {productsQuery.isError && (
          <p className="p-4 text-sm text-red-600">Failed to load products.</p>
        )}
        {productsQuery.data?.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No products found.</p>
        )}
        {productsQuery.data?.map((product) => (
          !onlyShowMine ? (
            <ProductInList product={product} key={product.id}/>
          ) : (
            product.ownerId == id && (<ProductInList product={product} key={product.id}/>)
          )
        ))}
      </Card>

      <br />
      <div className="flex gap-2 mb-6 flex items-center justify-between">
        <Button onClick={() => onlyShowMine ? setOnlyShowMine(false) : setOnlyShowMine(true)}>
          {onlyShowMine ? "Show all products" : "Only show my products"}
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            onClick={() => setGifting({ mode: "gift" })}
          >
            Gift all 
          </Button>
          <Button 
            variant="danger"
            disabled={deleteProduct.isPending}
            onClick={() => {
              if (confirm(`Delete all your products?`)) {
                deleteMany.mutate({})
              }
            }}
          >
            Delete all
          </Button>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editing.mode === "create" ? "New product" : "Edit product"}
            </h2>
            <ProductForm
              initialValues={
                editing.mode === "edit"
                  ? { name: editing.product.name, size: editing.product.size }
                  : undefined
              }
              submitLabel={editing.mode === "create" ? "Create" : "Save"}
              pending={createProduct.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={(body: ProductBody) => {
                if (editing.mode === "create") {
                  createProduct.mutate(body, { onSuccess: () => setEditing(null) });
                } 
                else {
                  updateProduct.mutate(
                    { id: editing.product.id, body },
                    { onSuccess: () => setEditing(null) }
                  );
                }
              }}
            />
          </Card>
        </div>
      )}

      {gifting && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Gift all your products to another person
            </h2>
            <GiftForm 
              onCancel={() => setGifting(null)}
              onSubmit={(newOwner: string) => {
                updateMany.mutate(
                  { newOwnerId: newOwner },
                  { onSuccess: () => setGifting(null)}
                )
              }}
            />
          </Card>
        </div>
      )}
    </main>
  );
}