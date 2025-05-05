
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  sku: string;
  onDiscountValue?: number;
  className?: string;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  stock,
  sku,
  onDiscountValue,
  className,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  const discountedPrice = onDiscountValue 
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price - (price * onDiscountValue / 100))
    : null;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-card-hover",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className={cn(
            "h-full w-full object-cover transition-transform duration-300",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        {onDiscountValue && (
          <Badge className="absolute top-2 left-2 bg-primary">
            {onDiscountValue}% OFF
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-lg">
            {discountedPrice || formattedPrice}
          </span>
          {discountedPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formattedPrice}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            SKU: {sku}
          </span>
          <span className={cn(
            "text-sm font-medium",
            stock > 10 ? "text-green-600" : stock > 0 ? "text-amber-600" : "text-red-600"
          )}>
            {stock > 0 ? `${stock} em estoque` : "Sem estoque"}
          </span>
        </div>
      </div>
      <div className="flex border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 rounded-none border-r h-10"
          asChild
        >
          <a href={`/produtos/editar/${id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 rounded-none h-10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-red-600">
              Confirmar exclusão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
