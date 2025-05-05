
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrdersHeaderProps {
  handleCreateOrder: () => void;
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = ({ handleCreateOrder }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-500 mt-1">Gerencie e acompanhe os pedidos</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleCreateOrder} className="bg-[#1E88E5] hover:bg-[#1976D2]">
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>
    </div>
  );
};
