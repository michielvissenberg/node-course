import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDeleteProduct, useProducts, useUpdateProduct } from "@/lib/api-hooks.product";
import { getId } from "@/lib/auth";
import { type FridgeView, type ProductView } from "@node-course/api-sdk";
import ProductInList from "./productInList";
import { useState } from "react";
import { GiftForm } from "./gift-form";

type Gifting = { mode: "gift"; product: ProductView } | null;

export default function SpecificFridge(props: {fridge: FridgeView}) {
  const [onlyShowMine, setOnlyShowMine] = useState<boolean>(false);
  const [gifting, setGifting] = useState<Gifting>(null);

  const productsQuery = useProducts(undefined, props.fridge.id);
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const id = getId();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Card className="divide-y divide-slate-100">
        {productsQuery.isLoading && (
          <p className="p-4 text-sm text-slate-500">Loading…</p>
        )}
        {productsQuery.isError && (
          <p className="p-4 text-sm text-red-600">Failed to load products in fridge.</p>
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
            onClick={() => {
                productsQuery.data?.map((product) => (
                  setGifting({ mode: "gift", product })
              ))
            }}
          >
            Gift all 
          </Button>
          <Button 
            variant="danger"
            disabled={deleteProduct.isPending}
            onClick={() => {
              if (confirm(`Delete all your products?`)) {
                productsQuery.data?.map((product) => (
                  product.ownerId == id ? deleteProduct.mutate(product.id) : null
                ))
              }
            }}
          >
            Delete all
          </Button>
        </div>
      </div>

      {gifting && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Gift all your products in this fridge to another person
            </h2>
            <GiftForm 
              onCancel={() => setGifting(null)}
              onSubmit={(newOwner: string) => {
                productsQuery.data?.map((product) => (
                  product.ownerId == id ? 
                    updateProduct.mutate(
                      { id: product.id, body: {
                        name: product.name,
                        size: product.size,
                        ownerId: newOwner,
                        fridgeId: product.fridgeId
                      }},
                      { onSuccess: () => setGifting(null) }
                    ) : null
                ))
              }}
            />
          </Card>
        </div>
      )}
    </main>
  );
}