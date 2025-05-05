
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  productCount: number;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Buscar categorias da tabela categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;

      if (categoriesData) {
        // Buscar contagem de produtos para cada categoria
        const categoriesWithCount = await Promise.all(
          categoriesData.map(async (category) => {
            const { count, error } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category', category.id);

            if (error) {
              console.error(`Erro ao buscar contagem para categoria ${category.name}:`, error);
              return null;
            }

            return {
              id: category.id,
              name: category.name,
              imageUrl: category.image_url || undefined,
              productCount: count || 0
            };
          })
        );

        setCategories(categoriesWithCount.filter(Boolean) as Category[]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar categorias:", error.message);
      toast("Erro ao carregar categorias", {
        description: "Por favor, tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, fetchCategories };
};
