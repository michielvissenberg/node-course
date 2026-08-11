"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FridgeBody, FridgeView } from "@node-course/api-sdk";
import {
  useFridges,
  useCreateFridge,
  useDeleteFridge,
  useUpdateFridge,
} from "@/lib/api-hooks.fridge";
import { clearToken, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FridgeForm } from "@/components/fridge-form";

import SpecificFridge from "../../components/specific-fridge";


type Editing = { mode: "create" } | { mode: "edit"; fridge: FridgeView } | null;
type Viewing = { fridge: FridgeView } | false;

export default function FridgesPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Editing>(null);
  const [viewing, setViewing] = useState<Viewing>(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const fridgesQuery = useFridges(search);
  const createFridge = useCreateFridge();
  const updateFridge = useUpdateFridge();
  const deleteFridge = useDeleteFridge();

  if (!authChecked) return null;

  const logout = () => {
    clearToken();
    router.replace("/login");
  };

  return (

    
    <main className="mx-auto max-w-3xl px-4 py-10">
      {!viewing && (
        <div>
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold mr-4">Fridges</h1>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => router.replace("/products")}>
                Browse products
              </Button>
              <Button variant="secondary" onClick={() => router.replace("/recipes")}>
                Browse recipes
              </Button>
              <Button variant="secondary" onClick={() => router.replace("/users")}>
                Browse users
              </Button>
              <Button onClick={() => setEditing({ mode: "create" })}>
                New fridge
              </Button>
              <Button variant="ghost" onClick={logout}>
                Log out
              </Button>
            </div>
          </header>

          <Input
            placeholder="Search by address..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mb-4"
          />

          <Card className="divide-y divide-slate-100">
            {fridgesQuery.isLoading && (
              <p className="p-4 text-sm text-slate-500">Loading…</p>
            )}
            {fridgesQuery.isError && (
              <p className="p-4 text-sm text-red-600">Failed to load fridges.</p>
            )}
            {fridgesQuery.data?.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No fridges found.</p>
            )}
            {fridgesQuery.data?.map((fridge) => (
              <div key={fridge.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">Address: {fridge.address}</p>
                  <p className="text-sm text-slate-500">Floor: {fridge.floor}</p>
                  <p className="text-sm text-slate-500">Capacity: {fridge.capacity}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setViewing({fridge})}
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditing({ mode: "edit", fridge })}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    disabled={deleteFridge.isPending}
                    onClick={() => {
                      if (confirm(`Delete ${fridge.address}?`)) {
                        deleteFridge.mutate(fridge.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editing.mode === "create" ? "New fridge" : "Edit fridge"}
            </h2>
            <FridgeForm
              initialValues={
                editing.mode === "edit"
                  ? { address: editing.fridge.address, floor: editing.fridge.floor, capacity: editing.fridge.capacity }
                  : undefined
              }
              submitLabel={editing.mode === "create" ? "Create" : "Save"}
              pending={createFridge.isPending || updateFridge.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={editing.mode === "create" 
                ? (body: FridgeBody) => 
                  {createFridge.mutate(body, { onSuccess: () => setEditing(null) });} 
                : (body: FridgeBody) => 
                  {updateFridge.mutate(
                    { id: editing.fridge.id, body },
                    { onSuccess: () => setEditing(null) }
                  );}
              }
            />
          </Card>
        </div>
      )}

      {viewing && (
        <div>
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Selected Fridge</h1>
            <div className="flex gap-2">
              <Button onClick={() => setViewing(false)}>
                back
              </Button>
            </div>
          </header>
          <p className="text-xl font-semibold">Address: {viewing.fridge.address}, Floor: {viewing.fridge.floor}, Capacity: {viewing.fridge.capacity}</p>
          <SpecificFridge fridge={viewing.fridge} />
      </div>
      )}
    </main>
  );
}