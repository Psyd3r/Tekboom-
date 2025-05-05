
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AdminStoreLink = () => {
  return (
    <Link to="/store">
      <Button variant="outline" size="sm" className="ml-2">
        <ShoppingBag className="h-4 w-4 mr-2" />
        Ir para Loja
      </Button>
    </Link>
  );
};
