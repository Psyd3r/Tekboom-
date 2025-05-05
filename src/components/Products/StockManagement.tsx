
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Package, Plus, MoreVertical, AlertTriangle, XCircle, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  image: string | null;
}

export function StockManagement() {
  const { toast: showToast } = useToast();
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
      showToast({
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
      
      toast.success(`Estoque atualizado: ${selectedProduct.name}`, {
        description: message
      });
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Erro ao atualizar estoque:", error);
      toast.error("Erro ao atualizar estoque", {
        description: error.message || "Por favor, tente novamente"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) {
      return {
        label: "Sem estoque",
        className: "text-red-600"
      };
    }
    
    if (stock <= 10) {
      return {
        label: "Estoque baixo",
        className: "text-amber-600"
      };
    }
    
    return {
      label: "Em estoque",
      className: "text-green-600"
    };
  };

  const getDialogTitle = () => {
    if (!selectedProduct) return "";
    
    switch (stockType) {
      case "set":
        return `Definir estoque: ${selectedProduct.name}`;
      case "add":
        return `Adicionar unidades: ${selectedProduct.name}`;
      case "remove":
        return `Remover unidades: ${selectedProduct.name}`;
      default:
        return `Atualizar estoque: ${selectedProduct.name}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Package className="mr-2 h-5 w-5" /> 
          Gestão de Estoque
        </h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className={stockFilter === "all" ? "bg-primary text-primary-foreground" : ""}
            onClick={() => setStockFilter("all")}
          >
            Todos
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={stockFilter === "low" ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:text-white" : ""}
            onClick={() => setStockFilter("low")}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Estoque baixo
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={stockFilter === "out" ? "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white" : ""}
            onClick={() => setStockFilter("out")}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Sem estoque
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="hidden sm:table-cell">SKU</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-center">Estoque</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nenhum produto encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center mr-3">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {product.sku}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{product.stock}</span>
                          <span className={`text-xs ${stockStatus.className}`}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(product, "set")}>
                              Definir estoque
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDialog(product, "add")}>
                              Adicionar unidades
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleOpenDialog(product, "remove")}
                              className="text-red-600"
                              disabled={product.stock <= 0}
                            >
                              Remover unidades
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {stockType === "set" && "Defina o novo valor do estoque."}
              {stockType === "add" && "Adicione unidades ao estoque atual."}
              {stockType === "remove" && "Remova unidades do estoque atual."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Estoque atual:</span>
                <span className="font-semibold">{selectedProduct.stock} unidades</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock-input">
                  {stockType === "set" && "Novo valor do estoque"}
                  {stockType === "add" && "Quantidade a adicionar"}
                  {stockType === "remove" && "Quantidade a remover"}
                </Label>
                <Input
                  id="stock-input"
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                />
              </div>
              
              {stockType !== "set" && (
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <span>Novo estoque:</span>
                    <span className="font-semibold">
                      {!newStock 
                        ? selectedProduct.stock
                        : stockType === "add" 
                          ? selectedProduct.stock + parseInt(newStock || "0")
                          : Math.max(0, selectedProduct.stock - parseInt(newStock || "0"))
                      } unidades
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStock} disabled={isUpdating || !newStock}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
