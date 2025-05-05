
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
import { ProductCardImage } from "./Card/ProductCardImage";
import { ProductCardInfo } from "./Card/ProductCardInfo";
import { ProductCardActions } from "./Card/ProductCardActions";
import { DeleteProductDialog } from "./Card/DeleteProductDialog";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  sku: string;
  category?: string;
  onDiscountValue?: number;
  className?: string;
  onDelete?: () => void;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  stock,
  sku,
  category,
  onDiscountValue,
  className,
  onDelete,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formattedPrice = formatCurrency(price);

  const discountedPrice = onDiscountValue 
    ? formatCurrency(price - (price * onDiscountValue / 100))
    : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Now we can simply delete the product
      // The ON DELETE CASCADE constraint will handle deleting related order_items
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Produto excluído", {
        description: "O produto foi excluído com sucesso."
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error("Erro ao excluir", {
        description: error.message || "Ocorreu um erro ao excluir o produto."
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-card-hover",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ProductCardImage 
          image={image} 
          name={name} 
          onDiscountValue={onDiscountValue} 
          isHovered={isHovered} 
        />
        
        <ProductCardInfo
          name={name}
          price={price}
          discountedPrice={discountedPrice}
          formattedPrice={formattedPrice}
          sku={sku}
          stock={stock}
          category={category}
        />
        
        <ProductCardActions
          id={id}
          isDeleting={isDeleting}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />
      </Card>

      <DeleteProductDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        productName={name}
        isDeleting={isDeleting}
        onConfirmDelete={handleDelete}
      />
    </>
  );
};
