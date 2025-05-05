
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { useFetchCategories } from "@/hooks/category/useFetchCategories";

interface ProductCardInfoProps {
  name: string;
  price: number;
  discountedPrice?: string | null;
  formattedPrice: string;
  sku: string;
  stock: number;
  category?: string;
}

export const ProductCardInfo = ({ 
  name, 
  discountedPrice, 
  formattedPrice, 
  sku, 
  stock,
  category
}: ProductCardInfoProps) => {
  const { data: categories = [] } = useFetchCategories();
  
  // Get category name from category ID if category is provided
  const categoryName = category ? categories.find(cat => cat.id === category)?.name || category : undefined;
  
  return (
    <div className="p-4">
      <h3 className="font-medium line-clamp-1">{name}</h3>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-bold text-lg">
          {discountedPrice || formattedPrice}
        </span>
        {discountedPrice && (
          <span className="text-sm text-gray-500 line-through">
            {formattedPrice}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          SKU: {sku}
        </span>
        <span className={cn(
          "text-sm font-medium",
          stock > 10 ? "text-green-600" : stock > 0 ? "text-amber-600" : "text-red-600"
        )}>
          {stock > 0 ? `${stock} em estoque` : "Sem estoque"}
        </span>
      </div>
      {categoryName && (
        <div className="mt-1">
          <span className="text-xs text-gray-500">
            Categoria: {categoryName}
          </span>
        </div>
      )}
    </div>
  );
};
