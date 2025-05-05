
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  image: string | null;
}

interface StockUpdateDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  stockType: "set" | "add" | "remove";
  newStock: string;
  setNewStock: (value: string) => void;
  isUpdating: boolean;
  handleUpdateStock: () => Promise<void>;
}

export function StockUpdateDialog({
  isDialogOpen,
  setIsDialogOpen,
  selectedProduct,
  stockType,
  newStock,
  setNewStock,
  isUpdating,
  handleUpdateStock
}: StockUpdateDialogProps) {
  if (!selectedProduct) return null;

  const getDialogTitle = () => {
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
  );
}
