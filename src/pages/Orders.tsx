
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { OrdersHeader } from "@/components/Orders/OrdersHeader";
import { OrderFilters } from "@/components/Orders/OrderFilters";
import { OrdersTable } from "@/components/Orders/OrdersTable";
import { OrderStats } from "@/components/Orders/OrderStats";
import { useOrders } from "@/hooks/useOrders";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { orders, loading, handleUpdateStatus } = useOrders();
  
  const navigate = useNavigate();
  
  const handleCreateOrder = () => {
    navigate('/pedidos/novo');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "recent" && new Date(order.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                      (activeTab === "pending" && (order.status === "pending" || order.status === "processing"));
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-amber-100 text-amber-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOrderClick = (orderId: string) => {
    toast("Visualizando pedido " + orderId);
  };

  const handlePrintLabel = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast("Gerando etiqueta para o pedido " + orderId);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <OrdersHeader handleCreateOrder={handleCreateOrder} />

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Todos os Pedidos</TabsTrigger>
          <TabsTrigger value="recent">Últimos 7 dias</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <CardTitle className="flex items-center">
                  Gerenciamento de Pedidos
                </CardTitle>
                <OrderFilters 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <OrdersTable 
                loading={loading}
                filteredOrders={filteredOrders}
                getStatusClass={getStatusClass}
                handleOrderClick={handleOrderClick}
                handlePrintLabel={handlePrintLabel}
                handleUpdateStatus={handleUpdateStatus}
                handleCreateOrder={handleCreateOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <OrderStats orders={orders} />
    </motion.div>
  );
};

export default Orders;
