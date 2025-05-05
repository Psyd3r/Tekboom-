
import { Link } from "react-router-dom";
import { Package, ChevronLeft } from "lucide-react";

export function StockHeader() {
  return (
    <div className="flex items-center mb-6">
      <Link to="/" className="mr-2 text-blue-500 hover:text-blue-700">
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <h2 className="text-xl font-bold flex items-center">
        <Package className="mr-2 h-5 w-5" /> 
        Gestão de Estoque
      </h2>
    </div>
  );
}
