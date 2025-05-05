
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PCComponent } from "@/types/buildpc";

export const useFetchPCComponents = (type?: string) => {
  return useQuery({
    queryKey: ['pc-components', type],
    queryFn: async () => {
      if (!type) {
        return [];
      }
      
      // Fetch products with the corresponding category
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', type)
        .order('price', { ascending: true });
      
      if (error) {
        console.error('Error fetching products for PC builder:', error);
        throw new Error('Failed to fetch products for PC builder');
      }
      
      // Map the product data to match the PCComponent structure
      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "https://placehold.co/300x300",
        type: type,
        specs: product.description || "",
        compatibility: []
      })) as PCComponent[];
    }
  });
};
