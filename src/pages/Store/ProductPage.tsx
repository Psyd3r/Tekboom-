
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Heart, ShoppingBag, Star, Check, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useFetchCategories } from "@/hooks/category/useFetchCategories";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const { data: categories = [] } = useFetchCategories();
  const { addToCart, isInCart, updateQuantity, getCartItem } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  
  // Find the product by ID when products are loaded
  useEffect(() => {
    if (!loading && products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image || "");
      }
    }
  }, [id, products, loading]);
  
  // Update quantity based on cart if product is already in cart
  useEffect(() => {
    if (product && isInCart(product.id)) {
      const cartItem = getCartItem(product.id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      }
    }
  }, [product, isInCart, getCartItem]);
  
  // Decrease quantity (minimum 1)
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Increase quantity
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Add to cart handler
  const handleAddToCart = () => {
    if (!product) return;
    
    if (isInCart(product.id)) {
      updateQuantity(product.id, quantity);
      toast.success("Quantidade atualizada no carrinho");
    } else {
      addToCart({
        id: crypto.randomUUID(),
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        total: product.price * quantity
      });
      toast.success("Produto adicionado ao carrinho");
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = () => {
    if (!product) return;
    
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  };
  
  // Get category name
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Categoria";
  };
  
  // Calculate the original price if there's a discount
  const getOriginalPrice = (price: number, discount: number) => {
    if (!discount) return null;
    return price / (1 - discount / 100);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center text-sm mb-4 text-gray-500">
          <Skeleton className="h-5 w-20" />
          <ChevronRight className="h-4 w-4 mx-1" />
          <Skeleton className="h-5 w-24" />
          <ChevronRight className="h-4 w-4 mx-1" />
          <Skeleton className="h-5 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Display not found state
  if (!product) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
        <p className="text-gray-500 mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/store/produtos">Ver outros produtos</Link>
        </Button>
      </div>
    );
  }
  
  const originalPrice = getOriginalPrice(product.price, product.discount);
  const rating = 4.5; // Default rating since it's not in the database
  const reviewCount = 12; // Default review count
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-8 space-y-8"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-4 text-gray-500">
        <Link to="/store" className="hover:text-primary">Início</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/store/produtos" className="hover:text-primary">Produtos</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link 
          to={`/store/categoria/${product.category}`} 
          className="hover:text-primary"
        >
          {getCategoryName(product.category)}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </div>
      
      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <div className="mb-4 border rounded-lg overflow-hidden bg-white">
            <img 
              src={selectedImage || product.image || "https://placehold.co/600x600"} 
              alt={product.name} 
              className="w-full h-auto object-contain aspect-square"
            />
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
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
              </div>
              <span className="text-sm text-gray-500">
                {rating} ({reviewCount} avaliações)
              </span>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.discount > 0 && (
                <Badge className="bg-red-600">-{product.discount}% OFF</Badge>
              )}
              {product.stock > 0 ? (
                <Badge className="bg-green-600">Em estoque</Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500 border-gray-300">Indisponível</Badge>
              )}
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {originalPrice && (
                <div className="text-gray-500 line-through">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(originalPrice)}
                </div>
              )}
              <div className="text-3xl font-bold text-[#0D47A1]">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(product.price)}
              </div>
              <div className="text-sm text-gray-500">
                à vista ou em até 12x de {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(product.price / 12)}
              </div>
            </div>
            
            {/* Quantity */}
            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium">Quantidade:</span>
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={increaseQuantity}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className={cn(
                  "flex-1 flex items-center gap-2",
                  isInCart(product.id) ? "bg-green-600 hover:bg-green-700" : ""
                )}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {isInCart(product.id) ? (
                  <>
                    <Check className="h-5 w-5" />
                    Atualizar carrinho
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    Adicionar ao carrinho
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={toggleFavorite}
                className={cn(
                  isInFavorites(product.id) ? "text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-600" : ""
                )}
              >
                <Heart className={cn(
                  "h-5 w-5 mr-2",
                  isInFavorites(product.id) ? "fill-red-500" : ""
                )} />
                {isInFavorites(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              </Button>
            </div>
          </div>
          
          {/* Description */}
          {product.description && (
            <div className="pt-6 border-t">
              <h3 className="font-medium mb-2">Descrição</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>
          )}
          
          {/* SKU */}
          <div className="text-sm text-gray-500">
            SKU: {product.sku}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPage;
