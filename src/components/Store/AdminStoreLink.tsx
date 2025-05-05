
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AdminStoreLink = () => {
  return (
    <Link to="/store">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1 bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
      >
        <ShoppingBag className="h-4 w-4" />
        <span>Ir para Loja</span>
      </Button>
    </Link>
  );
};
