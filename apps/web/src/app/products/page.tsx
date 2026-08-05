"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductBody, ProductView } from "@node-course/api-sdk";
import {
  useProducts,
  useCreateProduct,
} from "@/lib/api-hooks";
import { clearToken, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProductForm } from "@/components/product-form";

type Editing = { mode: "create" } | { mode: "edit"; product: ProductView } | null;

export default function ProductsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Editing>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const productsQuery = useProducts(search);
  const createProduct = useCreateProduct();

  if (!authChecked) return null;

  const logout = () => {
    clearToken();
    router.replace("/login");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.replace("/users")}>
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

      <Input
        placeholder="Search by name or expiration date..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mb-4"
      />

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
          <div key={product.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-slate-500">{product.expiresAt}</p>
            </div>
            <div className="flex gap-2">
              {/* <Button
                variant="secondary"
                onClick={() => setEditing({ mode: "edit", product: product })}
              >
                Edit
              </Button> */}
              {/* <Button
                variant="danger"
                disabled={.isPending}
                onClick={() => {
                  if (confirm(`Delete ${product.name}?`)) {
                    deleteUser.mutate(product.id);
                  }
                }}
              >
                Delete
              </Button> */}
            </div>
          </div>
        ))}
      </Card>

      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editing.mode === "create" ? "New product" : "Edit product"}
            </h2>
            <ProductForm
              initialValues={
                editing.mode === "edit"
                  ? { name: editing.product.name, expiresAt: editing.product.expiresAt }
                  : undefined
              }
              submitLabel={editing.mode === "create" ? "Create" : "Save"}
              pending={createProduct.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={(body: ProductBody) => {
                if (editing.mode === "create") {
                  createProduct.mutate(body, { onSuccess: () => setEditing(null) });
                } 
                // else {
                //   updateUser.mutate(
                //     { id: editing.user.id, body },
                //     { onSuccess: () => setEditing(null) }
                //   );
                // }
              }}
            />
          </Card>
        </div>
      )}
    </main>
  );
}