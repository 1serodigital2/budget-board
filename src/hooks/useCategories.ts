import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../api/category";

export const useCategories = () => {
  const { user } = useAuth();

  const useGetCategories = () => {
    return useQuery({
      queryKey: ["categories"],
      queryFn: () => getCategories(user!.id),
      enabled: !!user?.id,
    });
  };

  const useCategoriesQuery = () => {
    return useQuery({
      queryKey: ["categories"],
      queryFn: () => getCategories(user!.id),
    });
  };

  return {
    useGetCategories,
    useCategoriesQuery,
  };
};
