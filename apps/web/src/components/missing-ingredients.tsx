"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "./ui/card";
import { useProducts } from "@/lib/api-hooks.product";
import { getId } from "@/lib/auth";
import { RecipeView } from "@node-course/api-sdk";

export function MissingIngredients({
  recipe,
  onCancel,
}: {
  recipe: RecipeView;
  onCancel: () => void;
}){
  const id = getId();
  const productsQuery = useProducts(undefined, undefined, undefined, id ?? undefined);
  const recipeProducts = recipe.ingredients;

  const ownedProducts: string[] = [];
  if (productsQuery.data) {
    productsQuery.data.map((product) => {
      ownedProducts.push(product.name);
    })
  }
  const neededProducts: string[] = recipeProducts!.filter(x => !ownedProducts.includes(x));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
      <Card className="w-full max-w-md p-6" >
        <h2 className="mb-4 text-lg font-semibold">Products you need to buy:</h2>
        <ul className="space-y-2 mt-2">
          {neededProducts.map((product) => (
            <li className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm" key={product}>{product}</li>
          ))}  
        </ul>        
        <div className="flex justify-end">
          <Button 
            className="mt-2"
            onClick={() => onCancel()}
            >
          Go back
          </Button>
        </div>
          
      </Card>
    </div>
  );
}