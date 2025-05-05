
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { SelectedComponents } from "@/types/buildpc";

interface BuildPCSummaryProps {
  totalPrice: number;
  hasEssentialComponents: boolean;
  isCompatible: boolean;
  onAddToCart: () => void;
}

export const BuildPCSummary = ({ 
  totalPrice, 
  hasEssentialComponents, 
  isCompatible, 
  onAddToCart 
}: BuildPCSummaryProps) => {
  return (
    <CardFooter className="flex-col gap-4">
      <div className="w-full flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(totalPrice)}
        </span>
      </div>
      <Button 
        className="w-full" 
        size="lg" 
        onClick={onAddToCart}
        disabled={!hasEssentialComponents || !isCompatible}
      >
        Adicionar ao Carrinho
      </Button>
      {!hasEssentialComponents && (
        <p className="text-sm text-gray-500 text-center">
          Selecione todos os componentes essenciais para continuar
        </p>
      )}
    </CardFooter>
  );
};
