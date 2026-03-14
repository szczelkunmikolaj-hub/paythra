import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ServicePricing {
  id: string;
  service_name: string;
  service_domain: string;
  category: string;
  standard_price: number;
  student_price: number | null;
  family_price: number | null;
  cheapest_plan_name: string | null;
  cheapest_plan_price: number | null;
  country: string;
  last_updated: string;
}

export const useServicePricing = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["service_pricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_pricing")
        .select("*")
        .order("service_name");
      if (error) throw error;
      return data as ServicePricing[];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    services: query.data ?? [],
    isLoading: query.isLoading,
  };
};
