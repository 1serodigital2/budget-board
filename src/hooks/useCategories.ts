import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../api/category";
import { useUserId } from "../context/AuthContext";
import { queryClient } from "../services/supabase";
import { queryKeys } from "../services/queryKeys";
import type { CategoryInput } from "../types/category";

export const useCategories = () => {
  const uid = useUserId();
  return useQuery({
    queryKey: queryKeys.categories(uid),
    queryFn: () => getCategories(uid),
  });
};

export const useCategory = (id: number) => {
  const uid = useUserId();
  return useQuery({
    queryKey: queryKeys.category(uid, id),
    queryFn: () => getCategoryById(uid, id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useCreateCategory = () => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(uid, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useUpdateCategory = (id: number) => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (input: CategoryInput) => updateCategory(uid, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useDeleteCategory = () => {
  const uid = useUserId();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(uid, id),
    onSuccess: () =>
      Promise.all(
        ["categories", "expenses", "budgets", "trend"].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      ),
  });
};
