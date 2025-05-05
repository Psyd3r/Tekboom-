
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/Store/ProductCard";

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

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          originalPrice={product.discount ? product.price + (product.price * product.discount / 100) : undefined}
          image={product.image || "https://placehold.co/300x400"}
          rating={4.5} // Default value since we don't have a rating system yet
          isNew={false}
          isSale={!!product.discount && product.discount > 0}
          category={product.category || "Sem categoria"}
        />
      ))}
    </div>
  );
};
