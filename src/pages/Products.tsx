
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/Products/ProductCard";
import { AdminHeaderExtras } from "@/components/Layout/AdminHeaderExtras";

const Products = () => {
  const [products, setProducts] = useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    sku: string;
  }[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container px-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <div className="flex items-center space-x-2">
          <AdminHeaderExtras />
          <Button>
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button asChild>
            <Link to="/produtos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 h-[300px] animate-pulse bg-gray-100"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              stock={product.stock}
              sku={product.sku}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhum produto cadastrado.</p>
          <Button asChild>
            <Link to="/produtos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;
