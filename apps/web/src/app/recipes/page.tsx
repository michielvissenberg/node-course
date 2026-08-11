"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { RecipeBody, RecipeView } from "@node-course/api-sdk";
import {
  useRecipes,
  useCreateRecipe,
  useDeleteRecipe,
  useUpdateRecipe,
  useGetAiRecipe,
} from "@/lib/api-hooks.recipe";
import { clearToken, getId, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RecipeForm } from "@/components/recipe-form";
import { MissingIngredients } from "@/components/missing-ingredients";

type Editing = { mode: "create" } | { mode: "edit"; recipe: RecipeView } | null;
type Viewing = { mode: "view"; recipe: RecipeView } | {mode: "ingredients"; recipe: RecipeView} | false;

export default function RecipesPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Editing>(null);
  const [viewing, setViewing] = useState<Viewing>(false);
  const [aiRecipe, setAiRecipe] = useState<boolean>(false);
  const id = getId()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const recipesQuery = useRecipes(search);
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();
  const getAiRecipe = useGetAiRecipe();

  if (!authChecked) return null;

  const logout = () => {
    clearToken();
    router.replace("/login");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold mr-4">Recipes</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.replace("/fridges")}>
            Browse fridges
          </Button>
          <Button variant="secondary" onClick={() => router.replace("/products")}>
            Browse products
          </Button>
          <Button variant="secondary" onClick={() => router.replace("/users")}>
            Browse users
          </Button>
          <Button onClick={() => setEditing({ mode: "create" })}>
            New recipe
          </Button>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      <Input
        placeholder="Search by name or description or owner..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="mb-4"
      />

      <Card className="divide-y divide-slate-100">
        {recipesQuery.isLoading && (
          <p className="p-4 text-sm text-slate-500">Loading…</p>
        )}
        {recipesQuery.isError && (
          <p className="p-4 text-sm text-red-600">Failed to load recipes.</p>
        )}
        {recipesQuery.data?.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No recipes found.</p>
        )}
        {recipesQuery.data?.map((recipe) => (
          <div key={recipe.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">Name: {recipe.name}</p>
              <p className="text-sm text-slate-500">Description:{" "}
                {recipe.description.length > 50
                  ? recipe.description.slice(0, recipe.description.lastIndexOf(' ', 47)) + '...'
                  : recipe.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setViewing({mode: "view", recipe: recipe})}
              >
                View
              </Button>
              {recipe.ownerId == id && (
                <>
                <Button
                  variant="secondary"
                  onClick={() => setEditing({ mode: "edit", recipe })}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  disabled={deleteRecipe.isPending}
                  onClick={() => {
                    if (confirm(`Delete ${recipe.name}?`)) {
                      deleteRecipe.mutate(recipe.id);
                    }
                  }}
                >
                  Delete
                </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </Card>
      <Button
        className="mt-4"
        onClick={() => {
          getAiRecipe.mutate();
          setAiRecipe(true)
        }}
      >
        Get ai-generated recipe
      </Button>

      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editing.mode === "create" ? "New recipe" : "Edit recipe"}
            </h2>
            <RecipeForm
              initialValues={
                editing.mode === "edit"
                  ? { name: editing.recipe.name, description: editing.recipe.description, ingredients: editing.recipe.ingredients! }
                  : undefined
              }
              submitLabel={editing.mode === "create" ? "Create" : "Save"}
              pending={createRecipe.isPending || updateRecipe.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={editing.mode === "create" 
                ? (body: RecipeBody) => 
                  {createRecipe.mutate({
                    name: body.name,
                    description: body.description,
                    ingredients: body.ingredients!.slice(),                  
                    ownerId: id,
                  }, { onSuccess: () => setEditing(null) });} 
                : (body: RecipeBody) => 
                  {updateRecipe.mutate(
                    { id: editing.recipe.id, body: {
                      name: body.name,
                      description: body.description,
                      ingredients: body.ingredients!.slice(),
                      ownerId: id,
                    } },
                    { onSuccess: () => setEditing(null) }
                  );}
              }
            />
          </Card>
        </div>
      )}
      {viewing && viewing.mode == "view" && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {viewing.recipe.name}
            </h2>
              <p><b>Description:</b> {viewing.recipe.description}</p>
              <ul className="space-y-2 mt-2">
                <b>Ingredients: </b>
                {viewing.recipe.ingredients?.map((ingredient) =>
                  <li key={ingredient} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">{ingredient}</li>
                )}
              </ul>
              <div className="mt-2 flex justify-between">
                <Button variant="secondary" onClick={() => {
                    setViewing({mode: "ingredients", recipe: viewing.recipe});
                  }}>
                  show needed ingredients
                </Button>
                <Button onClick={() => setViewing(false)}>
                  back
                </Button>
              </div>
          </Card>
        </div>
      )}
      {viewing && viewing.mode == "ingredients" && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Ingredients for {viewing.recipe.name}
            </h2>
            <MissingIngredients 
              recipe={viewing.recipe} 
              onCancel={() => {
                setViewing({mode: "view", recipe: viewing.recipe});
              }}
            />
          </Card>
        </div>
      )}
      {aiRecipe && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-2xl p-6 overflow-scroll max-h-[70vh]"> 
            {getAiRecipe.isPending && (
              <p className="p-4 text-sm text-slate-500">Loading…</p>
            )}
            {getAiRecipe.isError && (
              <p className="p-4 text-sm text-red-600">Failed to get a recipe.</p>
            )}
            {getAiRecipe.data && (
              <>
                <h2 className="text-lg font-semibold">Recipe: {getAiRecipe.data.name}</h2>
                <p className=" text-sm text-slate-500"><b>Ingredients:</b> </p>
                <ul className="h-auto p-1 bg-white list-disc list-inside">
                  {getAiRecipe.data.ingredients?.map((ingredient) => 
                    <li key={ingredient.name} className={`list-item relative flex items-center gap-2 py-0 text-sm text-slate-500 `}>{ingredient.name} {ingredient.toBeBought && <>(need to buy)</>}</li>
                  )}
                </ul>
                <p className=" text-sm text-slate-500"><b>Description:</b> <br/>{getAiRecipe.data.description}</p>
                <p className="pt-4 text-sm text-slate-500"><b>Steps:</b> </p>
                <ul className="h-auto p-1 bg-white list-disc list-inside">
                  {getAiRecipe.data.steps?.map((step) => 
                    <li key={step} className={`list-item relative flex items-center gap-2 py-0 text-sm text-slate-500 `}>{step}</li>
                  )}
                </ul>
              </>
            )}
            <Button 
              onClick={() => {
                setAiRecipe(false)}
              }
            >
              Back
            </Button>
          </Card>
        </div>
      )}
    </main>
  );
}