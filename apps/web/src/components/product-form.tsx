"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ProductBody } from "@node-course/api-sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  expiresAt: z.string().min(1, "Expiration date is required"),
});

type ProductFormValues = z.infer<typeof schema>;

export function ProductForm({
  initialValues,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initialValues?: { name: string; expiresAt: string };
  submitLabel: string;
  pending: boolean;
  onSubmit: (body: ProductBody) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      expiresAt: initialValues?.expiresAt ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="space-y-4"
      noValidate
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="date">Expiration date</Label>
        <Input id="expiresAt" type="expiresAt" {...register("expiresAt")} />
        {errors.expiresAt && (
          <p className="mt-1 text-sm text-red-600">{errors.expiresAt.message}</p>
        )}
        {/* <p className="mt-1 text-xs text-slate-400">
          The example API requires all fields on update.
        </p> */}
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