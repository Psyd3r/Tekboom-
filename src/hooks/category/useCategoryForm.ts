
import { useState } from "react";
import { Category } from "../types/categoryTypes";

interface CategoryFormData {
  name: string;
  image: File | null;
}

export const useCategoryForm = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    image: null,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      image: null,
    });
    setSelectedCategory(null);
    setIsDialogOpen(false);
  };

  const editCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      image: null,
    });
    setIsDialogOpen(true);
  };

  const openNewCategoryDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return {
    selectedCategory,
    isDialogOpen,
    formData,
    setFormData,
    resetForm,
    editCategory,
    openNewCategoryDialog,
    setIsDialogOpen
  };
};
