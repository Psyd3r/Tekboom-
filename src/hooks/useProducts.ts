
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  category: string;
  discount?: number;
}

export const useProducts = (type: 'featured' | 'new' = 'featured', limit: number = 4) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      let query = supabase.from('products').select('*');
      
      if (type === 'featured') {
        // Featured products are those with discounts
        query = query
          .not('discount', 'is', null)
          .gt('discount', 0)
          .order('discount', { ascending: false });
      } else if (type === 'new') {
        // New products are most recently added ones
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply limit
      const { data, error } = await query.limit(limit);

      if (error) throw error;

      if (data) {
        // Transform data to match the Product interface
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.discount ? product.price * (100 / (100 - product.discount)) : undefined,
          image: product.image || "https://placehold.co/300x400",
          category: product.category || "",
          isNew: type === 'new',
          isSale: type === 'featured' && !!product.discount && product.discount > 0,
          discount: product.discount
        }));

        setProducts(formattedProducts);
      }
    } catch (error: any) {
      console.error(`Error fetching ${type} products:`, error.message);
      toast(`Erro ao carregar ${type === 'featured' ? 'produtos em destaque' : 'novos produtos'}: ${error.message}`, {
        description: "Por favor, tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [type, limit]);

  return { products, loading, fetchProducts };
};
