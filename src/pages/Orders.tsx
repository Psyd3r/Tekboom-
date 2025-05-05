import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Search, 
  Filter, 
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

// Empty state - no mock data
const orderData: Order[] = [];

type Order = {
  id: string;
  customer: string;
  date: string;
  total: string;
  items: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate('/pedidos/novo');
  };

  const filteredOrders = orderData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "recent" && new Date(order.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
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

  const handleUpdateStatus = (orderId: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast("Pedido " + orderId + " marcado como " + status);
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
                  <Package className="mr-2 h-5 w-5 text-primary" />
                  Gerenciamento de Pedidos
                </CardTitle>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Buscar pedido ou cliente"
                      className="w-full md:w-[250px] pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status do Pedido" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Processando</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="canceled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow 
                          key={order.id} 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleOrderClick(order.id)}
                        >
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.total}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                              {order.status === "processing" && "Processando"}
                              {order.status === "shipped" && "Enviado"}
                              {order.status === "delivered" && "Entregue"}
                              {order.status === "pending" && "Pendente"}
                              {order.status === "canceled" && "Cancelado"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => handlePrintLabel(order.id, e)}
                            >
                              Etiqueta
                            </Button>
                            <Select 
                              onValueChange={(value) => {
                                // Create a proper MouseEvent to pass to handleUpdateStatus
                                const syntheticEvent = { 
                                  stopPropagation: () => {} 
                                } as React.MouseEvent;
                                handleUpdateStatus(order.id, value, syntheticEvent);
                              }}
                              defaultValue={order.status}
                            >
                              <SelectTrigger className="w-[130px] inline-flex h-9">
                                <SelectValue placeholder="Mudar Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="processing">Processando</SelectItem>
                                <SelectItem value="shipped">Enviado</SelectItem>
                                <SelectItem value="delivered">Entregue</SelectItem>
                                <SelectItem value="canceled">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center p-6">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                              <Package className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
                            <p className="text-gray-500 text-center max-w-md mb-4">
                              Não há pedidos registrados. Você pode criar um novo pedido para começar.
                            </p>
                            <Button onClick={handleCreateOrder}>
                              <Package className="mr-2 h-4 w-4" />
                              Criar Novo Pedido
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Pedidos Hoje</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">0</CardTitle>
              <div className="p-1.5 bg-blue-50 rounded-full">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Nenhum pedido registrado hoje</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Pedidos Pendentes</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">0</CardTitle>
              <div className="p-1.5 bg-amber-50 rounded-full">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Nenhum pedido pendente</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Em Trânsito</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">0</CardTitle>
              <div className="p-1.5 bg-purple-50 rounded-full">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Nenhum pedido em trânsito</p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Entregues (7 dias)</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">0</CardTitle>
              <div className="p-1.5 bg-green-50 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Nenhum pedido entregue recentemente</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Orders;
