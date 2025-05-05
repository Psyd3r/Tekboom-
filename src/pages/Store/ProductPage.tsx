
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  Share2,
  ShoppingBag,
  Check,
  Minus,
  Plus,
  Star,
  ChevronRight,
  Truck,
  ShieldCheck,
  ArrowLeftRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { ProductCard } from "@/components/Store/ProductCard";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Type for product with color variants
interface ProductVariant {
  id: string;
  name: string; 
  available: boolean;
}

interface ProductWithVariants {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  features?: string[];
  rating?: number;
  reviewCount?: number;
  stock: number;
  sku: string;
  isNew?: boolean;
  isSale?: boolean;
  category?: string;
  brand?: string;
  images: string[];
  variants?: ProductVariant[];
  specs?: Record<string, string>;
  has_color_variants?: boolean;
}

// Hook to fetch product by ID
const useFetchProduct = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<ProductWithVariants | null> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        toast.error("Erro ao carregar o produto", {
          description: error.message,
        });
        return null;
      }

      if (!data) return null;

      // Process the product data
      let features: string[] = [];
      let specs: Record<string, string> = {};
      let variants: ProductVariant[] = [];
      let images: string[] = [];

      // Handle description, features, and specs
      if (data.description) {
        try {
          const descriptionData = JSON.parse(data.description);
          if (descriptionData.features && Array.isArray(descriptionData.features)) {
            features = descriptionData.features;
          }
          if (descriptionData.specs && typeof descriptionData.specs === 'object') {
            specs = descriptionData.specs;
          }
        } catch (e) {
          // If description is not valid JSON, use it as is
          features = [data.description];
        }
      }

      // Handle variants
      if (data.has_color_variants && data.variants) {
        try {
          const variantData = JSON.parse(data.variants);
          if (Array.isArray(variantData)) {
            variants = variantData;
          }
        } catch (e) {
          console.error("Error parsing variants:", e);
        }
      }

      // Handle images
      if (data.images) {
        try {
          const imageData = JSON.parse(data.images);
          if (Array.isArray(imageData)) {
            images = imageData;
          }
        } catch (e) {
          // If images is not valid JSON, use the image field
          images = [data.image];
        }
      } else if (data.image) {
        images = [data.image];
      }

      // Create final product object
      const product: ProductWithVariants = {
        id: data.id,
        name: data.name,
        price: data.price,
        original_price: data.discount ? data.price * (100 / (100 - data.discount)) : undefined,
        description: data.description,
        features,
        rating: data.rating || 4.5,
        reviewCount: data.review_count || 0,
        stock: data.stock || 0,
        sku: data.sku || "",
        isNew: !!data.is_new,
        isSale: !!data.discount && data.discount > 0,
        category: data.category,
        brand: data.brand || "TekBoom",
        images,
        variants,
        specs,
        has_color_variants: !!data.has_color_variants
      };

      // Add default color variant if no variants defined but has_color_variants is true
      if (product.has_color_variants && (!product.variants || product.variants.length === 0)) {
        product.variants = [{
          id: "default",
          name: "Padrão",
          available: product.stock > 0
        }];
      }

      return product;
    }
  });
};

// Hook to fetch related products
const useFetchRelatedProducts = (productId: string, category?: string) => {
  return useQuery({
    queryKey: ["relatedProducts", productId, category],
    queryFn: async () => {
      if (!category) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", productId)
        .limit(4);

      if (error) {
        console.error("Error fetching related products:", error);
        return [];
      }

      // Transform data to match the ProductCard interface
      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.discount ? product.price * (100 / (100 - product.discount)) : undefined,
        image: product.image || "https://placehold.co/300x400",
        rating: product.rating || 4.0,
        isNew: !!product.is_new,
        isSale: !!product.discount && product.discount > 0,
        category: product.category || ""
      }));
    },
    enabled: !!category
  });
};

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isInFavorites } = useFavorites();
  
  // Fetch product data
  const { data: product, isLoading, error } = useFetchProduct(id || "");
  
  // Fetch related products
  const { data: relatedProducts = [] } = useFetchRelatedProducts(id || "", product?.category);
  
  // Reset selected variant when product changes
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // Find first available variant
      const availableVariant = product.variants.find(v => v.available);
      setSelectedVariant(availableVariant?.id || product.variants[0].id);
    } else {
      setSelectedVariant(null);
    }
    // Reset quantity and selected image
    setQuantity(1);
    setSelectedImage(0);
  }, [product]);
  
  // Format price and calculate discount percentage
  const formattedPrice = product?.price ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price) : "R$ 0,00";
  
  const formattedOriginalPrice = product?.original_price ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.original_price) : null;
  
  const discount = product?.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast("Quantidade máxima disponível atingida");
    }
  };
  
  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        category: product.category || ""
      });
    }
  };
  
  const addToCartHandler = () => {
    if (product) {
      // Check if product has variants and one is selected
      if (product.has_color_variants && !selectedVariant) {
        toast.error("Por favor, selecione uma cor");
        return;
      }

      // Get selected variant name or default to null
      const variantName = product.has_color_variants && selectedVariant 
        ? product.variants?.find(v => v.id === selectedVariant)?.name || null
        : null;
      
      addToCart({
        id: crypto.randomUUID(),
        product_id: product.id,
        name: product.name + (variantName ? ` - ${variantName}` : ""),
        price: product.price,
        quantity: quantity,
        image: product.images[0] || null,
        total: product.price * quantity
      });
      
      toast.success(`${quantity} ${quantity > 1 ? 'unidades' : 'unidade'} do produto adicionado ao carrinho`);
    }
  };
  
  const shareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link do produto copiado para a área de transferência");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando produto...</span>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Produto não encontrado</h2>
        <p className="text-gray-600 mb-6">O produto que você está procurando não está disponível.</p>
        <Button asChild><Link to="/store/produtos">Ver outros produtos</Link></Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6 text-gray-500 overflow-x-auto whitespace-nowrap">
        <Link to="/store" className="hover:text-primary">Início</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/store/produtos" className="hover:text-primary">Produtos</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        {product.category && (
          <>
            <Link to={`/store/categoria/${product.category}`} className="hover:text-primary">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
          </>
        )}
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-100">
              <img 
                src={product.images[selectedImage] || "https://placehold.co/600x600"} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-20 h-20 rounded border border-gray-100 overflow-hidden",
                      selectedImage === index && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {product.isNew && (
                <Badge className="bg-blue-500 hover:bg-blue-600">Novo</Badge>
              )}
              {product.isSale && (
                <Badge className="bg-[#E53935] hover:bg-red-700">-{discount}%</Badge>
              )}
              <span className="text-gray-500 text-sm">SKU: {product.sku}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating || 0) 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {product.rating || 0} ({product.reviewCount || 0} avaliações)
                </span>
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
              {formattedOriginalPrice && (
                <span className="text-lg text-gray-500 line-through">{formattedOriginalPrice}</span>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Product Color Variants */}
            {product.has_color_variants && product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Cor</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      className={cn(
                        "px-4 py-2 border rounded-md transition-all",
                        selectedVariant === variant.id
                          ? "border-primary text-primary"
                          : "border-gray-200 text-gray-700",
                        !variant.available && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => variant.available && setSelectedVariant(variant.id)}
                      disabled={!variant.available}
                    >
                      {variant.name}
                      {!variant.available && " (Esgotado)"}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Quantidade</h3>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-l-md hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-14 h-10 flex items-center justify-center border-t border-b border-gray-200">
                  {quantity}
                </div>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-r-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="ml-3 text-sm text-gray-500">
                  {product.stock} unidades disponíveis
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button 
                className="flex-1 md:flex-none md:w-[200px]"
                onClick={addToCartHandler}
                disabled={product.stock <= 0}
              >
                {isInCart(product.id) ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    No Carrinho
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Adicionar ao Carrinho
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className="aspect-square h-[42px] w-[42px] p-0"
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isInFavorites(product.id) && "fill-[#E53935] text-[#E53935]"
                  )}
                />
              </Button>
              
              <Button
                variant="outline"
                className="aspect-square h-[42px] w-[42px] p-0"
                onClick={shareProduct}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">Entrega em todo o Brasil</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">Garantia de 12 meses</span>
              </div>
              <div className="flex items-center">
                <ArrowLeftRight className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">7 dias para troca</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Info Tabs */}
        <div className="border-t border-gray-100">
          <Tabs defaultValue="features">
            <div className="px-6 border-b border-gray-100">
              <TabsList className="h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="features"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4 px-4"
                >
                  Recursos
                </TabsTrigger>
                <TabsTrigger 
                  value="specs"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4 px-4"
                >
                  Especificações
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-4 px-4"
                >
                  Avaliações
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="features" className="p-6 mt-0">
              {product.features && product.features.length > 0 ? (
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhum recurso específico cadastrado para este produto.</p>
              )}
            </TabsContent>
            
            <TabsContent value="specs" className="p-6 mt-0">
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-b-0">
                      <div className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="md:col-span-2 text-gray-700">{value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma especificação cadastrada para este produto.</p>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6 mt-0">
              <div className="text-center p-8">
                <h3 className="text-xl font-medium mb-2">Avaliações de Clientes</h3>
                <div className="flex justify-center items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-6 w-6",
                        i < Math.floor(product.rating || 0) 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  {product.rating || 0} de 5 ({product.reviewCount || 0} avaliações)
                </p>
                <Button>Escrever avaliação</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Related Products */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                price={relatedProduct.price}
                originalPrice={relatedProduct.originalPrice}
                image={relatedProduct.image}
                rating={relatedProduct.rating}
                isNew={relatedProduct.isNew}
                isSale={relatedProduct.isSale}
                category={relatedProduct.category}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum produto relacionado encontrado.</p>
        )}
      </section>
    </motion.div>
  );
};

export default ProductPage;
