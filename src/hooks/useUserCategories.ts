import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface UserCategory {
  id: string;
  user_id: string;
  category_name: string;
  created_at: string;
}

const DEFAULT_CATEGORIES = [
  { value: "streaming", label: "Streaming" },
  { value: "gaming", label: "Gaming" },
  { value: "software", label: "Software" },
  { value: "productivity", label: "Productivity" },
  { value: "sports", label: "Sports" },
  { value: "other", label: "Other" },
];

export const useUserCategories = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user_categories", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_categories")
        .select("*")
        .order("category_name");
      if (error) throw error;
      return data as UserCategory[];
    },
    enabled: !!user,
  });

  const addCategory = useMutation({
    mutationFn: async (categoryName: string) => {
      const { error } = await supabase
        .from("user_categories")
        .insert({ user_id: user!.id, category_name: categoryName.toLowerCase().trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_categories"] });
      toast({ title: "Category added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_categories"] });
      toast({ title: "Category removed" });
    },
  });

  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...(query.data ?? []).map((c) => ({
      value: c.category_name,
      label: c.category_name.charAt(0).toUpperCase() + c.category_name.slice(1),
    })),
  ];

  // Deduplicate
  const seen = new Set<string>();
  const uniqueCategories = allCategories.filter((c) => {
    if (seen.has(c.value)) return false;
    seen.add(c.value);
    return true;
  });

  return {
    categories: uniqueCategories,
    customCategories: query.data ?? [],
    addCategory: addCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
    isLoading: query.isLoading,
  };
};
