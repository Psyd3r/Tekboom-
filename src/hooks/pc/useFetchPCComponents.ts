
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PCComponent } from "@/types/buildpc";

export const useFetchPCComponents = (type?: string) => {
  return useQuery({
    queryKey: ['pc-components', type],
    queryFn: async () => {
      let query = supabase.from('pc_components').select('*');
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query.order('price', { ascending: true });
      
      if (error) {
        console.error('Error fetching PC components:', error);
        throw new Error('Failed to fetch PC components');
      }
      
      return data as PCComponent[];
    }
  });
};
