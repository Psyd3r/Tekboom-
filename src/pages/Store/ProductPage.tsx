
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setProduct(data);
      } catch (error: any) {
        console.error("Erro ao buscar produto:", error.message);
        toast.error("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Reset showAddedToCart when the cart status changes directly (e.g., when removing from cart)
  useEffect(() => {
    if (id && !isInCart(id)) {
      setShowAddedToCart(false);
    }
  }, [isInCart, id]);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: crypto.randomUUID(),
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "https://placehold.co/300x300",
      quantity: quantity,
      total: product.price * quantity,
    });
    
    // Show added to cart state for 2 seconds
    setShowAddedToCart(true);
    setTimeout(() => {
      setShowAddedToCart(false);
    }, 2000);
    
    toast.success("Produto adicionado ao carrinho");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p>O produto que você está procurando não está disponível.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-xl bg-muted">
          <img
            src={product.image || "https://placehold.co/600x600"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-4">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(product.price)}
              </div>
              {product.discount && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-sm text-muted-foreground line-through">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(product.price * (100 / (100 - product.discount)))}
                  </div>
                  <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {product.discount}% OFF
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Descrição</h2>
              <p className="text-muted-foreground">
                {product.description || "Sem descrição disponível."}
              </p>
            </div>

            {product.specs && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Especificações</h2>
                <p className="text-muted-foreground">{product.specs}</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium text-lg">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncreaseQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {showAddedToCart || isInCart(product.id) ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key="added-button"
                  className="w-full"
                >
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Check className="mr-2 h-4 w-4" /> Produto no carrinho
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key="add-button"
                  className="w-full"
                >
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao carrinho
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
