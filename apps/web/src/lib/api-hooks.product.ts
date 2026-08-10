"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  createProduct, 
  deleteProduct, 
  listProducts, 
  type ProductBody,
  updateProduct, 
} from "@node-course/api-sdk";

const PRODUCT_KEY = ["product"];

export function useProducts(search?: string, fridgeId?: string, fridgeLocation?: string, ownerId?: string) {
  return useQuery({
    queryKey: [...PRODUCT_KEY, {search, fridgeId, fridgeLocation}],
    queryFn: async () => {
      const queryParams = {
        ...(search && { search }),
        ...(fridgeId && { fridgeId }),
        ...(fridgeLocation && { fridgeLocation }),
        ...(ownerId && { ownerId }),
      }
      const { data, error } = await listProducts({
        query: Object.keys(queryParams).length ? queryParams : undefined,
      });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: ProductBody) => {
      const { data, error } = await createProduct({ body });
      if (error) throw error;
      return data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_KEY }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: ProductBody }) => {
      const { data, error } = await updateProduct({ path: { id }, body });
      if (error) {
        throw error;
      }
      return data!;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_KEY }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteProduct({ path: { id } });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_KEY }),
  });
}
