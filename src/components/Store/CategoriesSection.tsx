
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/Store/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  productCount: number;
}

interface CategoriesSectionProps {
  categories: Category[];
  loading: boolean;
}

export const CategoriesSection = ({ categories, loading }: CategoriesSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <Link to="/store/categorias" className="text-primary flex items-center hover:underline">
          Ver todas
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton 
              key={item}
              className="rounded-lg overflow-hidden aspect-square"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              imageUrl={category.imageUrl || "https://placehold.co/300x300"}
              productCount={category.productCount}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">Nenhuma categoria disponível.</p>
        </div>
      )}
    </section>
  );
};
