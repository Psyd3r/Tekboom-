
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/hooks/types/categoryTypes";

interface CategoryDropdownProps {
  categories: Category[];
  isLoading: boolean;
  onItemClick?: () => void;
}

export const CategoryDropdown = ({ categories, isLoading, onItemClick = () => {} }: CategoryDropdownProps) => {
  // Filter only categories that have products
  const activeCategories = categories.filter(cat => cat.productCount && cat.productCount > 0);
  
  return (
    <div className="py-2">
      {isLoading ? (
        <div className="px-4 py-2">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5 mt-2" />
        </div>
      ) : activeCategories.length > 0 ? (
        activeCategories.map(category => (
          <Link
            key={category.id}
            to={`/store/categoria/${category.id}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            onClick={onItemClick}
          >
            {category.name}
            {category.productCount > 0 && (
              <span className="text-xs text-gray-500 ml-2">({category.productCount})</span>
            )}
          </Link>
        ))
      ) : (
        <p className="px-4 py-2 text-sm text-gray-500">Nenhuma categoria encontrada</p>
      )}
    </div>
  );
};
