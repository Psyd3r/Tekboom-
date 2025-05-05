
import { useState } from "react";
import { useFetchCategories } from "./category/useFetchCategories";
import { useCategoryMutations } from "./category/useCategoryMutations";
import { useCategoryForm } from "./category/useCategoryForm";
import { Category } from "./types/categoryTypes";

export type { Category };

export const useCategoriesAdmin = () => {
  const { data: categories = [], isLoading: isFetching } = useFetchCategories();
  const { isLoading: isMutating, createCategory, updateCategory, deleteCategory } = useCategoryMutations();
  const {
    selectedCategory,
    isDialogOpen,
    formData,
    setFormData,
    resetForm,
    editCategory,
    openNewCategoryDialog,
    setIsDialogOpen
  } = useCategoryForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return false;
    }
    
    let success = false;
    if (selectedCategory) {
      success = await updateCategory(selectedCategory.id, formData.name, formData.image);
    } else {
      success = await createCategory(formData.name, formData.image);
    }
    
    if (success) {
      resetForm();
    }
    
    return success;
  };

  return {
    categories,
    isLoading: isMutating || isFetching,
    selectedCategory,
    isDialogOpen,
    formData,
    setFormData,
    openNewCategoryDialog,
    editCategory,
    deleteCategory,
    handleSubmit,
    setIsDialogOpen,
  };
};
