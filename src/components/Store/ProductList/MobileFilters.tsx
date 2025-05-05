
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { CategoryFilter } from "./CategoryFilter";
import { Category } from "@/hooks/types/categoryTypes";

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  categories: Category[];
  categoriesLoading: boolean;
  categoryId?: string;
}

export const MobileFilters = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  categories,
  categoriesLoading,
  categoryId
}: MobileFiltersProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="w-80 bg-white h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-medium text-lg">Filtros</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar produtos"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Price Range */}
          <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} />
          
          {/* Categories */}
          <Accordion type="multiple" defaultValue={["categories"]}>
            <AccordionItem value="categories">
              <AccordionTrigger className="py-2">Categorias</AccordionTrigger>
              <AccordionContent>
                <CategoryFilter 
                  categories={categories} 
                  isLoading={categoriesLoading} 
                  currentCategoryId={categoryId} 
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="pt-4">
            <Button className="w-full" onClick={onClose}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
