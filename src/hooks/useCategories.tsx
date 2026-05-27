import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../api/category";

export const useCategories = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(user!.uid),
    enabled: !!user?.uid,
  });
};
