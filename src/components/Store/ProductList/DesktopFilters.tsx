
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { CategoryFilter } from "./CategoryFilter";
import { Category } from "@/hooks/types/categoryTypes";

interface DesktopFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  categories: Category[];
  categoriesLoading: boolean;
  categoryId?: string;
}

export const DesktopFilters = ({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  categories,
  categoriesLoading,
  categoryId
}: DesktopFiltersProps) => {
  return (
    <div className="hidden md:block space-y-6">
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <h2 className="font-medium text-lg mb-4">Filtros</h2>
        
        <div className="space-y-6">
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
          
          <Button className="w-full" onClick={() => setSearchQuery("")}>Limpar Filtros</Button>
        </div>
      </div>
    </div>
  );
};
