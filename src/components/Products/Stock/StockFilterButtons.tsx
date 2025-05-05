
import { Button } from "@/components/ui/button";
import { AlertTriangle, XCircle } from "lucide-react";

interface StockFilterButtonsProps {
  stockFilter: "all" | "low" | "out";
  setStockFilter: (filter: "all" | "low" | "out") => void;
}

export function StockFilterButtons({ stockFilter, setStockFilter }: StockFilterButtonsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Button 
        variant="default" 
        size="sm"
        className={stockFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}
        onClick={() => setStockFilter("all")}
      >
        Todos
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className={stockFilter === "low" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-800"}
        onClick={() => setStockFilter("low")}
      >
        <AlertTriangle className="h-4 w-4 mr-1" />
        Estoque baixo
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className={stockFilter === "out" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800"}
        onClick={() => setStockFilter("out")}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Sem estoque
      </Button>
    </div>
  );
}
