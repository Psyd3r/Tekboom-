
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFetchCategories } from "@/hooks/category/useFetchCategories";
import { CategoryOption } from "@/hooks/types/categoryTypes";

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  category: string;
  discount: string;
  image: string;
}

interface UseProductFormProps {
  editMode?: boolean;
  productId?: string;
}

export function useProductForm({ editMode = false, productId }: UseProductFormProps = {}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: categories = [], isLoading: categoriesLoading } = useFetchCategories();
  
  const [formData, setFormData] = useState<ProductFormState>({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    category: "",
    discount: "",
    image: "https://images.unsplash.com/photo-1597338770339-b3923abdb198?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3NkfGVufDB8fDB8fHww",
  });
  
  // Transform categories into options for the select component
  const categoryOptions: CategoryOption[] = categories.map(category => ({
    value: category.id,
    label: category.name
  }));
  
  // Fetch product data when in edit mode
  useEffect(() => {
    if (editMode && productId) {
      setIsLoading(true);
      fetchProduct(productId);
    }
  }, [editMode, productId]);

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Erro ao carregar produto",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setFormData({
          name: data.name,
          description: data.description || "",
          price: data.price.toString(),
          stock: data.stock.toString(),
          sku: data.sku,
          category: data.category || "",
          discount: data.discount ? data.discount.toString() : "",
          image: data.image || "https://images.unsplash.com/photo-1597338770339-b3923abdb198?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3NkfGVufDB8fDB8fHww",
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erro desconhecido",
        description: "Ocorreu um erro ao carregar o produto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    isLoading,
    handleChange,
    handleSelectChange,
    categoryOptions,
    categoriesLoading,
    categories
  };
}
