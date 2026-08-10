"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/lib/api-hooks.user";
import { useState } from "react";
import { Card } from "./ui/card";

export function GiftForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (ownerId: string) => void;
  onCancel: () => void;
}){
  const [search, setSearch] = useState("");
  const usersQuery = useUsers(search);

  return (
    <>
    <Input
        placeholder="Search user to gift products to..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mb-4"
    />
    <Card className="divide-y divide-slate-100">
      {usersQuery.isLoading && (
        <p className="p-4 text-sm text-slate-500">Loading…</p>
      )}
      {usersQuery.isError && (
        <p className="p-4 text-sm text-red-600">Failed to load users.</p>
      )}
      {usersQuery.data?.length === 0 && (
        <p className="p-4 text-sm text-slate-500">No users found.</p>
      )}
      {usersQuery.data?.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => onSubmit(user.id)}
            >
              Gift
            </Button>
          </div>
        </div>
      ))}
    </Card>
    <br />
    <Button 
      onClick={() => onCancel()}
    >
      Cancel
    </Button>
    </>
  );
}