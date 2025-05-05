
import { ProductGrid } from "./ProductGrid";
import { ProductList } from "./ProductList";
import { EmptyProductsState } from "./EmptyProductsState";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  category: string;
  discount?: number;
}

interface ProductsDisplayProps {
  isLoading: boolean;
  products: Product[];
  viewMode: string;
  onClearFilters: () => void;
}

export const ProductsDisplay = ({ 
  isLoading, 
  products, 
  viewMode,
  onClearFilters
}: ProductsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100">
            <div className="h-48 bg-gray-100 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-9 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return <EmptyProductsState onClearFilters={onClearFilters} />;
  }
  
  return viewMode === 'grid' ? (
    <ProductGrid products={products} />
  ) : (
    <ProductList products={products} />
  );
};
