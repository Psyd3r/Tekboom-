
import { Button } from "@/components/ui/button";

interface EmptyProductsStateProps {
  onClearFilters: () => void;
}

export const EmptyProductsState = ({ onClearFilters }: EmptyProductsStateProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
      <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
      <p className="text-gray-500 mb-4">
        Tente ajustar os filtros ou buscar por outro termo.
      </p>
      <Button onClick={onClearFilters}>Limpar Filtros</Button>
    </div>
  );
};
