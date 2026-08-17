"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RecipeBody } from "@node-course/api-sdk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "description is required"),
  ingredients: z.array(z.string()).min(1, "Add at least one ingredient")
});

type RecipeFormValues = z.infer<typeof schema>;

export function RecipeForm({
  initialValues,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initialValues?: { name: string; description: string, ingredients: string[] };
  submitLabel: string;
  pending: boolean;
  onSubmit: (body: RecipeBody) => void;
  onCancel: () => void;
}) {
  const [currentIngredient, setCurrentIngredient] = useState("");

  const {
    register,
    handleSubmit,
    setValue, 
    watch,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      ingredients: initialValues?.ingredients ?? [],
    },
  });

  const ingredientsArray = watch("ingredients") || [];
  const handleAddIngredient = () => {
    if (!currentIngredient.trim()) return;

    const updatedIngredients = [...ingredientsArray, currentIngredient.trim()];
    setValue("ingredients", updatedIngredients, { shouldValidate: true });
    
    setCurrentIngredient(""); 
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    const updatedIngredients = ingredientsArray.filter((_, index) => index !== indexToRemove);
    setValue("ingredients", updatedIngredients, { shouldValidate: true });
  };

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
        <Label>Description</Label>
        <Input id="description" {...register("description")} />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="ingredient-input">Ingredients</Label>
        <div className="flex justify-between gap-2">
          <Input 
            id="ingredient-input" 
            value={currentIngredient} 
            onChange={(e) => setCurrentIngredient(e.target.value)} 
          />
          <Button type="button" onClick={handleAddIngredient}>Add</Button>
        </div>
        {errors.ingredients && (
          <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>
        )}
      </div>
      <ul className="space-y-1 mt-2">
        {ingredientsArray.map((ingredient, index) => (
          <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
            <span>{ingredient}</span>
            <Button type="button" onClick={() => handleRemoveIngredient(index)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
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