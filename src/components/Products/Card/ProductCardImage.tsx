
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardImageProps {
  image: string;
  name: string;
  onDiscountValue?: number;
  isHovered: boolean;
}

export const ProductCardImage = ({ image, name, onDiscountValue, isHovered }: ProductCardImageProps) => {
  return (
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
  );
};
