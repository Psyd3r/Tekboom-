
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
}

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div 
          key={product.id}
          className="bg-white rounded-lg border border-gray-100 overflow-hidden flex"
        >
          <div className="w-32 h-32 shrink-0 bg-gray-50">
            <img 
              src={product.image || "https://placehold.co/300x400"} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <div className="text-xs text-gray-500 mb-1">{product.category || "Sem categoria"}</div>
              <Link to={`/store/produto/${product.id}`} className="block">
                <h3 className="font-medium text-gray-800 mb-1 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(product.price)}
                </span>
                {product.discount && product.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(product.price + (product.price * product.discount / 100))}
                  </span>
                )}
              </div>
              <Button 
                size="sm"
                asChild
              >
                <Link to={`/store/produto/${product.id}`}>
                  Ver produto
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
