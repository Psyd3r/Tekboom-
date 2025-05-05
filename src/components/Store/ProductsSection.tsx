
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/Store/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

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

interface ProductsSectionProps {
  title: string;
  linkUrl: string;
  linkText: string;
  products: Product[];
  loading: boolean;
  emptyTitle?: string;
}

export const ProductsSection = ({ 
  title, 
  linkUrl, 
  linkText, 
  products, 
  loading, 
  emptyTitle = "Produto" 
}: ProductsSectionProps) => {
  
  // Function to render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhum {emptyTitle.toLowerCase()} encontrado</h3>
      <p className="text-gray-500 mb-4">
        Não há produtos disponíveis nesta seção no momento.
      </p>
      <Button asChild>
        <Link to="/store/produtos">Ver todos os produtos</Link>
      </Button>
    </div>
  );
  
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link to={linkUrl} className="text-primary flex items-center hover:underline">
          {linkText}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton 
              key={item}
              className="rounded-lg overflow-hidden h-[320px]"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              rating={product.rating || 4}
              isNew={product.isNew}
              isSale={product.isSale}
              category={product.category}
            />
          ))}
        </div>
      ) : (
        renderEmptyState()
      )}
    </section>
  );
};
