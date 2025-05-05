
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Category } from "../types/categoryTypes";

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      // First get all categories from the categories table
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesError) {
        toast.error("Erro ao carregar categorias", { 
          description: categoriesError.message 
        });
        throw categoriesError;
      }

      // Get all unique category values from products table
      const { data: productCategories, error: productCategoriesError } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);

      if (productCategoriesError) {
        toast.error("Erro ao carregar categorias de produtos", { 
          description: productCategoriesError.message 
        });
        throw productCategoriesError;
      }

      // Create a map of existing categories for easy lookup
      const existingCategories = new Map(
        categoriesData.map(category => [category.id, category])
      );

      // Add product categories that aren't already in the categories table
      const uniqueProductCategories = new Set(
        productCategories
          .map(product => product.category)
          .filter(category => category && category.trim() !== "")
      );

      // Combine both sets of categories
      const allCategories: Category[] = [...categoriesData];

      // For product categories that don't exist in the categories table,
      // create temporary category objects with properly formatted dates
      const currentDate = new Date().toISOString();
      
      uniqueProductCategories.forEach(categoryId => {
        if (!existingCategories.has(categoryId)) {
          const newCategory: Category = {
            id: categoryId,
            name: categoryId, // Use the ID as the name for now
            image_url: null,
            created_at: currentDate,
            updated_at: currentDate,
            productCount: 0 // Will be counted later
          };
          allCategories.push(newCategory);
          existingCategories.set(categoryId, newCategory);
        }
      });

      // Count products for each category
      for (const category of allCategories) {
        const { count, error: countError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("category", category.id);

        if (!countError) {
          category.productCount = count || 0;
        }
      }

      return allCategories;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
