
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/hooks/types/categoryTypes";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  category: string;
  discount: string;
  image: string;
}

interface UseProductSubmitProps {
  editMode: boolean;
  productId?: string;
  setIsSubmitting: (value: boolean) => void;
  categories: Category[];
}

export function useProductSubmit({
  editMode,
  productId,
  setIsSubmitting,
  categories
}: UseProductSubmitProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, formData: ProductFormData) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku,
        category: formData.category,
        discount: formData.discount ? parseInt(formData.discount) : 0,
        image: formData.image,
      };

      let result;
      
      if (editMode && productId) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId);
      } else {
        // Insert new product
        result = await supabase
          .from('products')
          .insert([productData]);
      }

      if (result.error) {
        throw result.error;
      }

      // If a category doesn't exist in the categories table yet, create it
      if (formData.category && formData.category.trim() !== "") {
        const categoryExists = categories.some(cat => cat.id === formData.category);
        
        if (!categoryExists) {
          const { error: categoryError } = await supabase
            .from('categories')
            .insert([{
              id: formData.category,
              name: formData.category
            }]);
          
          if (categoryError) {
            console.error("Failed to create category:", categoryError);
          }
        }
      }

      toast({
        title: editMode ? "Produto atualizado com sucesso!" : "Produto adicionado com sucesso!",
        description: `${formData.name} foi ${editMode ? "atualizado" : "adicionado"} ao catálogo.`,
      });
      
      navigate("/produtos");
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Erro ao salvar produto",
        description: error.message || "Ocorreu um erro ao salvar o produto.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
}
