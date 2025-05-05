
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  category: string;
}

export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  isNew = false,
  isSale = false,
  category,
}: ProductCardProps) => {
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
  
  const formattedOriginalPrice = originalPrice ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(originalPrice) : null;
  
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInFavorites(id)) {
      addToFavorites({
        id,
        name,
        price,
        image,
        category
      });
    } else {
      removeFromFavorites(id);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInCart(id)) {
      addToCart({
        id: crypto.randomUUID(),
        product_id: id,
        name,
        price,
        quantity: 1,
        image,
        total: price
      });
    } else {
      toast("Produto já está no carrinho");
    }
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {isNew && (
          <Badge className="bg-[#0D47A1] hover:bg-[#0A3D8F] px-2 py-1">Novo</Badge>
        )}
        {isSale && originalPrice && (
          <Badge className="bg-[#E53935] hover:bg-red-700 px-2 py-1">-{discount}%</Badge>
        )}
      </div>
      
      {/* Favorite Button */}
      <button
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
        onClick={toggleFavorite}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isInFavorites(id) ? "fill-[#E53935] text-[#E53935]" : "text-gray-400"
          )}
        />
      </button>
      
      {/* Product Image */}
      <Link to={`/store/produto/${id}`} className="block overflow-hidden">
        <div className="h-48 overflow-hidden">
          <img
            src={image || "https://placehold.co/300x400"}
            alt={name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        <Link to={`/store/produto/${id}`}>
          <div className="text-xs text-gray-500 mb-1">{category}</div>
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 hover:text-[#1E88E5] transition-colors">
            {name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(rating) 
                    ? "fill-amber-400 text-amber-400" 
                    : "text-gray-300"
                )}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({rating})</span>
          </div>
          
          {/* Price */}
          <div className="flex flex-col mb-3">
            {formattedOriginalPrice && (
              <span className="text-sm text-gray-500 line-through">
                De: {formattedOriginalPrice}
              </span>
            )}
            <span className="text-xl font-bold text-[#0D47A1]">
              {formattedPrice}
            </span>
            <span className="text-xs text-gray-600">
              à vista ou em até 12x
            </span>
          </div>
        </Link>
        
        {/* Add to Cart */}
        <Button 
          className={cn(
            "w-full flex items-center justify-center gap-2",
            isInCart(id) 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-[#1E88E5] hover:bg-[#1976D2]"
          )}
          onClick={handleAddToCart}
        >
          {isInCart(id) ? (
            <>
              <Check className="h-4 w-4" />
              No carrinho
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Adicionar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
