"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRecipe,
  deleteRecipe,
  listRecipes,
  updateRecipe,
  getAiRecipe,
  type RecipeBody,
} from "@node-course/api-sdk";

const RECIPES_KEY = ["recipes"];

export function useRecipes(search: string) {
  return useQuery({
    queryKey: [...RECIPES_KEY, search],
    queryFn: async () => {
      const { data, error } = await listRecipes({
        query: search ? { search } : undefined,
      });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: RecipeBody) => {
      const { data, error } = await createRecipe({ body });
      if (error) throw error;
      return data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RECIPES_KEY }),
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: RecipeBody }) => {
      const { data, error } = await updateRecipe({ path: { id }, body });
      if (error) {
        throw error;
      }
      return data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RECIPES_KEY }),
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteRecipe({ path: { id } });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RECIPES_KEY }),
  });
}

export function useGetAiRecipe() {
  return useQuery({
    queryKey: [...RECIPES_KEY],
    queryFn: async () => {
      const {data, error} = await getAiRecipe()
      if (error) throw error;
      return data ?? "";
    },
  })
}
