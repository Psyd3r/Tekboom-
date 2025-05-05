
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  image: string | null;
}

export function useStockManagement() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStock, setNewStock] = useState("");
  const [stockType, setStockType] = useState<"set" | "add" | "remove">("set");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

  useEffect(() => {
    fetchProducts();
  }, [stockFilter]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("products").select("id, name, price, stock, sku, image");
      
      if (stockFilter === "low") {
        query = query.gt("stock", 0).lte("stock", 10);
      } else if (stockFilter === "out") {
        query = query.lte("stock", 0);
      }
      
      const { data, error } = await query.order("name");
      
      if (error) {
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (product: Product, type: "set" | "add" | "remove") => {
    setSelectedProduct(product);
    setStockType(type);
    setNewStock("");
    setIsDialogOpen(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;
    
    setIsUpdating(true);
    
    try {
      const stockValue = parseInt(newStock);
      
      if (isNaN(stockValue)) {
        throw new Error("Valor de estoque inválido");
      }
      
      let newStockValue: number;
      
      switch (stockType) {
        case "set":
          newStockValue = stockValue;
          break;
        case "add":
          newStockValue = selectedProduct.stock + stockValue;
          break;
        case "remove":
          newStockValue = Math.max(0, selectedProduct.stock - stockValue);
          break;
        default:
          newStockValue = stockValue;
      }
      
      const { error } = await supabase
        .from("products")
        .update({ stock: newStockValue })
        .eq("id", selectedProduct.id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar o produto na lista local
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? { ...p, stock: newStockValue } : p
      ));
      
      let message = "";
      switch (stockType) {
        case "set":
          message = `Estoque definido como ${newStockValue}`;
          break;
        case "add":
          message = `${stockValue} unidades adicionadas ao estoque`;
          break;
        case "remove":
          message = `${stockValue} unidades removidas do estoque`;
          break;
      }
      
      sonnerToast.success(`Estoque atualizado: ${selectedProduct.name}`, {
        description: message
      });
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Erro ao atualizar estoque:", error);
      sonnerToast.error("Erro ao atualizar estoque", {
        description: error.message || "Por favor, tente novamente"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    products,
    isLoading,
    isUpdating,
    selectedProduct,
    isDialogOpen,
    setIsDialogOpen,
    newStock,
    setNewStock,
    stockType,
    stockFilter,
    setStockFilter,
    handleOpenDialog,
    handleUpdateStock
  };
}
