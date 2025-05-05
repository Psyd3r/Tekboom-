
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Category } from "../types/categoryTypes";
import { v4 as uuidv4 } from "uuid";

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Criar categoria
  const createCategory = async (name: string, imageFile: File | null): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 1. Criar a categoria no banco
      const { data, error } = await supabase
        .from("categories")
        .insert({ name })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 2. Se tiver imagem, fazer upload
      if (imageFile) {
        const fileName = `${data.id}/${uuidv4()}`;
        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        // 3. Atualizar a categoria com a URL da imagem
        const { data: publicUrlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(fileName);
          
        const imageUrl = publicUrlData.publicUrl;

        const { error: updateError } = await supabase
          .from("categories")
          .update({ image_url: imageUrl })
          .eq("id", data.id);

        if (updateError) {
          throw updateError;
        }
      }

      toast("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      return true;
    } catch (error: any) {
      toast("Erro ao criar categoria", {
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar categoria
  const updateCategory = async (id: string, name: string, imageFile: File | null): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 1. Atualizar nome
      const updateData: { name: string; image_url?: string } = { name };
      
      // 2. Se tiver imagem nova, fazer upload e atualizar URL
      if (imageFile) {
        const fileName = `${id}/${uuidv4()}`;
        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("category-images")
          .getPublicUrl(fileName);
          
        updateData.image_url = publicUrlData.publicUrl;
      }
      
      // 3. Atualizar registro
      const { error } = await supabase
        .from("categories")
        .update(updateData)
        .eq("id", id);

      if (error) {
        throw error;
      }

      // 4. Update any products using the old category ID
      // This ensures product categories stay in sync with their display names
      const { error: productUpdateError } = await supabase
        .from("products")
        .update({ category: id })
        .eq("category", id);

      if (productUpdateError) {
        console.error("Error updating products with category:", productUpdateError);
        // We don't throw here to avoid failing the whole operation
      }

      toast("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // Also update product lists since category names might have changed
      queryClient.invalidateQueries({ queryKey: ["products"] });
      return true;
    } catch (error: any) {
      toast("Erro ao atualizar categoria", {
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir categoria
  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Verificar se existem produtos usando essa categoria
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category", id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        toast("Não é possível excluir esta categoria", {
          description: `Existem ${count} produtos associados a ela.`
        });
        return false;
      }

      // Excluir categoria
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast("Categoria excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      return true;
    } catch (error: any) {
      toast("Erro ao excluir categoria", {
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
