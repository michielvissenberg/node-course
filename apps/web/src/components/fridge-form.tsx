"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FridgeBody } from "@node-course/api-sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  address: z.string().min(1, "Address is required"),
  floor: z.number().nonnegative(),
  capacity: z.number().nonnegative(),
});

type FridgeFormValues = z.infer<typeof schema>;

export function FridgeForm({
  initialValues,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initialValues?: { address: string, floor: number, capacity: number };
  submitLabel: string;
  pending: boolean;
  onSubmit: (body: FridgeBody) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FridgeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: initialValues?.address ?? "",
      floor: initialValues?.floor ?? 0,
      capacity: initialValues?.capacity ?? 0
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="space-y-4"
      noValidate
    >
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address")} />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="floor">Floor</Label>
        <Input id="floor" {...register("floor", {valueAsNumber: true})} />
        {errors.floor && (
          <p className="mt-1 text-sm text-red-600">{errors.floor.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input id="capacity" {...register("capacity", {valueAsNumber: true})} />
        {errors.capacity && (
          <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}