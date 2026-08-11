"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFridge,
  deleteFridge,
  listFridges,
  updateFridge,
  type FridgeBody,
} from "@node-course/api-sdk";

const FRIDGES_KEY = ["fridges"];

export function useFridges(search?: string) {
  return useQuery({
    queryKey: [...FRIDGES_KEY, search],
    queryFn: async () => {
      const { data, error } = await listFridges({
        query: search ? { search } : undefined,
      });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateFridge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: FridgeBody) => {
      const { data, error } = await createFridge({ body });
      if (error) throw error;
      return data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIDGES_KEY }),
  });
}

export function useUpdateFridge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: FridgeBody }) => {
      const { data, error } = await updateFridge({ path: { id }, body });
      if (error) {
        throw error;
      }
      return data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIDGES_KEY }),
  });
}

export function useDeleteFridge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteFridge({ path: { id } });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FRIDGES_KEY }),
  });
}
