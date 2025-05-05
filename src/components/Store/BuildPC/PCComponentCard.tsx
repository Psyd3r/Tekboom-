
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PCComponent } from "@/types/buildpc";

interface PCComponentCardProps {
  component: PCComponent;
  isSelected: boolean;
  onSelect: (component: PCComponent) => void;
}

export const PCComponentCard = ({ component, isSelected, onSelect }: PCComponentCardProps) => {
  return (
    <Card key={component.id} className="overflow-hidden">
      <div className="aspect-square bg-gray-100 relative">
        <img 
          src={component.image} 
          alt={component.name} 
          className="object-contain w-full h-full p-4"
        />
      </div>
      <CardHeader className="py-3">
        <CardTitle className="text-base">{component.name}</CardTitle>
        <CardDescription>{component.specs}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between pt-0">
        <span className="font-bold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(component.price)}
        </span>
        <Button 
          onClick={() => onSelect(component)}
          variant={isSelected ? "secondary" : "default"}
        >
          {isSelected ? "Selecionado" : "Selecionar"}
        </Button>
      </CardFooter>
    </Card>
  );
};
