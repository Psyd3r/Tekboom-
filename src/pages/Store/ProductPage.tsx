
import { useState } from "react";
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
  ArrowLeftRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { ProductCard } from "@/components/Store/ProductCard";
import { motion } from "framer-motion";

// Mock data - would be replaced with real data fetching
const product = {
  id: "1",
  name: "Smartphone XYZ Pro Max",
  price: 1999.99,
  originalPrice: 2499.99,
  description: "O Smartphone XYZ Pro Max é o mais avançado da linha, com tela de alta resolução, câmera de última geração e bateria de longa duração. Perfeito para quem busca o melhor em tecnologia.",
  features: [
    "Tela Super AMOLED de 6.7\"",
    "Câmera principal de 108MP",
    "Processador Octa-core de última geração",
    "Bateria de 5000mAh",
    "Carregamento rápido de 45W",
    "Resistente à água e poeira (IP68)"
  ],
  rating: 4.5,
  reviewCount: 127,
  stock: 15,
  sku: "SP-XYZ-1234",
  isNew: true,
  isSale: true,
  category: "Eletrônicos",
  brand: "TechXYZ",
  images: [
    "https://placehold.co/600x600",
    "https://placehold.co/600x600/eee/ccc",
    "https://placehold.co/600x600/ddd/aaa",
    "https://placehold.co/600x600/ccc/888"
  ],
  variants: [
    { id: "v1", name: "Preto", available: true },
    { id: "v2", name: "Azul", available: true },
    { id: "v3", name: "Branco", available: false },
  ],
  specs: {
    dimensions: "165.1 x 75.6 x 8.9 mm",
    weight: "228g",
    display: "Super AMOLED, 120Hz, HDR10+",
    camera: "108 MP (principal), 12 MP (ultra-wide), 10 MP (telephoto)",
    battery: "5000mAh, carregamento rápido 45W",
    os: "Android 12",
    chipset: "Snapdragon 8 Gen 1",
    memory: "8GB RAM, 256GB armazenamento"
  }
};

// Mock related products
const relatedProducts = [
  {
    id: "2",
    name: "Smartphone XYZ Standard",
    price: 1499.99,
    originalPrice: 1899.99,
    image: "https://placehold.co/300x400",
    rating: 4.3,
    isNew: false,
    isSale: true,
    category: "Eletrônicos"
  },
  {
    id: "3",
    name: "Smartphone XYZ Lite",
    price: 999.99,
    image: "https://placehold.co/300x400",
    rating: 4.1,
    isNew: false,
    isSale: false,
    category: "Eletrônicos"
  },
  {
    id: "4",
    name: "Carregador Rápido XYZ",
    price: 129.99,
    originalPrice: 179.99,
    image: "https://placehold.co/300x400",
    rating: 4.7,
    isNew: false,
    isSale: true,
    category: "Acessórios"
  },
  {
    id: "5",
    name: "Fone de Ouvido Bluetooth XYZ",
    price: 199.99,
    image: "https://placehold.co/300x400",
    rating: 4.6,
    isNew: true,
    isSale: false,
    category: "Acessórios"
  }
];

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("v1");
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Format price and calculate discount percentage
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price);
  
  const formattedOriginalPrice = product.originalPrice ? new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.originalPrice) : null;
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast("Quantidade máxima disponível atingida");
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success("Produto adicionado aos favoritos");
    } else {
      toast("Produto removido dos favoritos");
    }
  };
  
  const addToCart = () => {
    toast.success(`${quantity} ${quantity > 1 ? 'unidades' : 'unidade'} do produto adicionado ao carrinho`);
  };
  
  const shareProduct = () => {
    toast("Link do produto copiado para a área de transferência");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6 text-gray-500">
        <Link to="/store" className="hover:text-primary">Início</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/store/produtos" className="hover:text-primary">Produtos</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to={`/store/categoria/${product.category}`} className="hover:text-primary">{product.category}</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-700 font-medium truncate">{product.name}</span>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-100">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
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
                      i < Math.floor(product.rating) 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">{product.rating} ({product.reviewCount} avaliações)</span>
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
            
            {/* Product Variants */}
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
                onClick={addToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </Button>
              
              <Button
                variant="outline"
                className="aspect-square h-[42px] w-[42px] p-0"
                onClick={toggleFavorite}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isFavorite && "fill-[#E53935] text-[#E53935]"
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
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="specs" className="p-6 mt-0">
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
                        i < Math.floor(product.rating) 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  {product.rating} de 5 ({product.reviewCount} avaliações)
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
      </section>
    </motion.div>
  );
};

export default ProductPage;
