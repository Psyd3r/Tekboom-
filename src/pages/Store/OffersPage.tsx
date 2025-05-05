
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/Store/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { AlertTriangle, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/Store/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  category: string;
  discount?: number;
}

const OffersPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch products with discounts
  const fetchDiscountedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .not('discount', 'is', null)
        .gt('discount', 0)
        .order('discount', { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform data to match the Product interface
        const formattedProducts: Product[] = data.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.discount ? product.price * (100 / (100 - product.discount)) : undefined,
          image: product.image || "https://placehold.co/300x400",
          category: product.category || "",
          isSale: true,
          discount: product.discount
        }));

        setProducts(formattedProducts);
      }
    } catch (error: any) {
      console.error("Error fetching discounted products:", error.message);
      toast("Erro ao carregar ofertas: " + error.message, {
        description: "Por favor, tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  // Get current date in DD/MM/YYYY format
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#0D47A1] text-white rounded-lg mb-8">
        <div className="container py-10 px-4">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="h-6 w-6" />
            <p className="font-medium">{currentDate}</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Ofertas do Dia</h1>
          <p className="text-lg opacity-90">
            Aproveite nossos melhores descontos! Promoções válidas por tempo limitado.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Skeleton 
                key={item}
                className="rounded-lg overflow-hidden h-[400px]"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                rating={product.rating || 4}
                isNew={product.isNew}
                isSale={true}
                category={product.category}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma oferta disponível"
            description="No momento não há produtos com desconto disponíveis. Volte mais tarde ou confira todos os nossos produtos."
            actionText="Ver todos os produtos"
            actionLink="/store/produtos"
          />
        )}
      </div>
    </motion.div>
  );
};

export default OffersPage;
