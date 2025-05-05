
import { Loader2 } from "lucide-react";
import { ProductFormHeader } from "./Form/ProductFormHeader";
import { ProductFormFields } from "./Form/ProductFormFields";
import { ProductFormActions } from "./Form/ProductFormActions";
import { useProductForm } from "./Form/useProductForm";
import { useProductSubmit } from "./Form/useProductSubmit";

interface ProductFormProps {
  editMode?: boolean;
  productId?: string;
}

export function ProductForm({ editMode = false, productId }: ProductFormProps) {
  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    isLoading,
    handleChange,
    handleSelectChange,
    categoryOptions,
    categoriesLoading,
    categories
  } = useProductForm({ editMode, productId });

  const { handleSubmit } = useProductSubmit({
    editMode,
    productId,
    setIsSubmitting,
    categories
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <ProductFormHeader editMode={editMode} />

      <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-8">
        <ProductFormFields
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          categoryOptions={categoryOptions}
          categoriesLoading={categoriesLoading}
        />
        
        <ProductFormActions isSubmitting={isSubmitting} editMode={editMode} />
      </form>
    </div>
  );
}
