
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
}

export const PriceRangeFilter = ({ priceRange, setPriceRange }: PriceRangeFilterProps) => {
  return (
    <div>
      <h3 className="font-medium text-sm mb-3">Preço</h3>
      <Slider
        value={priceRange}
        min={0}
        max={5000}
        step={10}
        onValueChange={(value) => setPriceRange(value as [number, number])}
        className="mb-3"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(priceRange[0])}
        </span>
        <span className="text-sm">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(priceRange[1])}
        </span>
      </div>
    </div>
  );
};
