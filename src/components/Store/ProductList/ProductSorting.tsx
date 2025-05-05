
import { Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductSortingProps {
  sortOption: string;
  setSortOption: (value: string) => void;
  viewMode: string;
  setViewMode: (value: string) => void;
  displayRange: { start: number; end: number; total: number };
}

export const ProductSorting = ({ 
  sortOption, 
  setSortOption, 
  viewMode, 
  setViewMode,
  displayRange 
}: ProductSortingProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex-1">
        <p className="text-gray-500 text-sm">
          Exibindo {displayRange.start > 0 ? displayRange.start : 0}-
          {Math.min(displayRange.end, displayRange.total)} de {displayRange.total} produtos
        </p>
      </div>
      
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Mais Relevantes</SelectItem>
            <SelectItem value="price-asc">Menor Preço</SelectItem>
            <SelectItem value="price-desc">Maior Preço</SelectItem>
            <SelectItem value="name">Ordem Alfabética</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="hidden sm:flex border border-gray-200 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-r-none ${viewMode === 'grid' ? 'bg-[#F5F9FF] text-primary' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-l-none ${viewMode === 'list' ? 'bg-[#F5F9FF] text-primary' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
