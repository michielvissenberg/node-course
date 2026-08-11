import { ProductBody, ProductView } from "@node-course/api-sdk";
import { Button } from "./ui/button";
import { getId } from "@/lib/auth";
import { useCreateProduct, useDeleteProduct, useUpdateProduct } from "@/lib/api-hooks.product";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { ProductForm } from "./product-form";
import { useFridges } from "@/lib/api-hooks.fridge";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { GiftForm } from "./gift-form";

type Editing = { mode: "create" } | { mode: "edit"; product: ProductView } | null;
type InFridge = { mode: "putIn"; product: ProductView } | null;
type Gifting = { mode: "gift"; product: ProductView } | null;

export default function ProductInList(props: {product: ProductView}) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);
  
  const [editing, setEditing] = useState<Editing>(null);
  const [inFridge, setInFridge] = useState<InFridge>(null);
  const [gifting, setGifting] = useState<Gifting>(null);
  const product = props.product
  
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const fridges = useFridges();
  const id = getId()

  const [openDropdown, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };
  
  if (!authChecked) return null;
  return (
    <main>
      {props.product.ownerId == id || props.product.ownerId == null ? (
        <div key={props.product.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{props.product.name}</p>
            <p className="text-sm text-slate-500">{props.product.size}</p>
          </div>
          <div className="flex gap-2">
            {props.product.fridgeId == null &&(
              <Button
                variant="secondary"
                onClick={() => setInFridge({mode: "putIn", product})}
              >
                Put in fridge
              </Button>
            )}
            {props.product.fridgeId && (
              <Button
                variant="secondary"
                onClick={() => updateProduct.mutate({
                  id: props.product.id,
                  body: {
                    name: props.product.name,
                    size: props.product.size,
                    ownerId: id,
                    fridgeId: null
                  }
                })}
              >
                Take out of fridge
              </Button>
          )}
            {props.product.ownerId == null && (
              <Button
                variant="secondary"
                onClick={() => {
                  updateProduct.mutate(
                    { id: props.product.id, body: 
                      {
                        name: props.product.name,
                        size: props.product.size,
                        ownerId: id,
                      } 
                    },
                  );
                }}
              >
                Claim
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {setGifting({mode: "gift", product})}}
            >
              Gift
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditing({ mode: "edit", product })}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              disabled={deleteProduct.isPending}
              onClick={() => {
                if (confirm(`Delete ${product.name}?`)) {
                  deleteProduct.mutate(product.id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ):(
        <div key={props.product.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{props.product.name}</p>
            <p className="text-sm text-slate-500">{props.product.size}</p>
          </div>
        </div>
      )}


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

    {inFridge && (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
        <Card className="w-full max-w-md p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Select a fridge
          </h2>
          <div className="flex justify-between gap-2">
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md text-sm border border-[#e4e4e7] h-10 px-4 py-2"
                onClick={handleToggle}
              >
                Available Fridges
              </button>
              {openDropdown && (
                <div className="absolute left-0 top-12">
                  <ul className="w-56 h-auto shadow-md rounded-md p-1 border bg-white">
                    {fridges.data?.map((fridge, index) => (
                      <li
                        key={index}
                        className={`relative flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 rounded-md`}
                        onClick={() => {
                          updateProduct.mutate(
                            { 
                              id: product.id, 
                              body: { 
                                name: product.name, 
                                size: product.size, 
                                ownerId: product.ownerId, 
                                fridgeId: fridge.id, 
                              } 
                            },
                            {
                              onSuccess: () => {
                                handleToggle();
                                setInFridge(null);
                              }
                            }
                          );
                        }}
                      >
                        Address: {fridge.address}, Floor: {fridge.floor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button onClick={() => setInFridge(null)}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    )}
    {gifting && (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
        <Card className="w-full max-w-md p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Gift all your products in this fridge to another person
          </h2>
          <GiftForm 
            onCancel={() => setGifting(null)}
            onSubmit={(newOwner: string) => {
              updateProduct.mutate(
                { id: product.id, body: {
                  name: product.name,
                  size: product.size,
                  ownerId: newOwner,
                  fridgeId: product.fridgeId
                }},
                { onSuccess: () => setGifting(null) } 
              )
            }}
          />
        </Card>
      </div>
    )}
    </main>

  )
}