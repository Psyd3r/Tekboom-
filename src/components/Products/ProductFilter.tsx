
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";

export interface FilterOptions {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  stock: string;
}

interface ProductFilterProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
  onFilter: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export function ProductFilter({
  isOpen,
  onClose,
  categories,
  onFilter,
  initialFilters = {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    stock: ""
  }
}: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      stock: ""
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[350px] sm:w-[450px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" /> 
            Filtrar Produtos
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Pesquisar
            </label>
            <Input
              id="search"
              placeholder="Nome ou SKU do produto"
              value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Categoria
            </label>
            <Select 
              value={filters.category} 
              onValueChange={value => handleFilterChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
                Preço Mínimo
              </label>
              <Input
                id="minPrice"
                type="number"
                placeholder="R$ 0"
                value={filters.minPrice}
                onChange={e => handleFilterChange("minPrice", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
                Preço Máximo
              </label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="R$ 9999"
                value={filters.maxPrice}
                onChange={e => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-1">
              Estoque
            </label>
            <Select 
              value={filters.stock} 
              onValueChange={value => handleFilterChange("stock", value)}
            >
              <SelectTrigger id="stock">
                <SelectValue placeholder="Status de estoque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="in">Em estoque</SelectItem>
                <SelectItem value="low">Estoque baixo</SelectItem>
                <SelectItem value="out">Sem estoque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleResetFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
          <Button 
            className="w-full" 
            onClick={handleApplyFilters}
          >
            <Search className="h-4 w-4 mr-2" />
            Aplicar Filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
