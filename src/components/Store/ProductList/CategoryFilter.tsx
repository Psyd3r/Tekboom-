
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/hooks/types/categoryTypes";

interface CategoryFilterProps {
  categories: Category[];
  isLoading: boolean;
  currentCategoryId?: string;
}

export const CategoryFilter = ({ categories, isLoading, currentCategoryId }: CategoryFilterProps) => {
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center py-3">
          <Loader className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-2 mt-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`}
                checked={currentCategoryId === category.id}
                onCheckedChange={() => {
                  if (currentCategoryId === category.id) {
                    window.location.href = "/store/produtos";
                  } else {
                    window.location.href = `/store/categoria/${category.id}`;
                  }
                }}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm flex-1 cursor-pointer"
              >
                {category.name}
              </label>
              <span className="text-xs text-gray-500">({category.productCount})</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-2">Nenhuma categoria encontrada</p>
      )}
    </>
  );
};
