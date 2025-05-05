
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

type Order = {
  id: string;
  customer: {
    full_name: string | null;
    email: string;
  };
  created_at: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  items_count?: number;
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Buscar pedidos com join adequado para obter os dados do perfil do cliente
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          created_at,
          total_amount,
          customer_id,
          profiles:profiles!customer_id(full_name, email)
        `)
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
      
      // Buscar itens dos pedidos para contar
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('order_id, id');
        
      if (itemsError) throw itemsError;
      
      // Calcular contagem de itens
      const itemCounts: Record<string, number> = {};
      itemsData?.forEach(item => {
        if (itemCounts[item.order_id]) {
          itemCounts[item.order_id]++;
        } else {
          itemCounts[item.order_id] = 1;
        }
      });
      
      // Formatar pedidos com dados do cliente
      const formattedOrders = ordersData?.map(order => ({
        id: order.id,
        customer: {
          // Corrigindo o acesso aos dados do perfil
          full_name: order.profiles?.full_name || 'Sem nome',
          email: order.profiles?.email || 'email@exemplo.com'
        },
        created_at: order.created_at,
        total_amount: order.total_amount,
        status: order.status as Order['status'],
        items_count: itemCounts[order.id] || 0
      })) || [];
      
      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateStatus = async (orderId: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast.success(`Pedido ${orderId} marcado como ${status}`);
      
      // Update order in state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: status as Order['status'] } 
          : order
      ));
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  // Calculate order stats
  const getTodayOrders = () => orders.filter(order => 
    new Date(order.created_at).toDateString() === new Date().toDateString()
  ).length;
  
  const getPendingOrders = () => orders.filter(order => 
    order.status === 'pending'
  ).length;
  
  const getShippedOrders = () => orders.filter(order => 
    order.status === 'shipped'
  ).length;
  
  const getDeliveredOrdersLastWeek = () => orders.filter(order => 
    order.status === 'delivered' && 
    new Date(order.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

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
                      <SelectItem value="">Todos os Status</SelectItem>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex items-center justify-center">
                            <div className="text-gray-500">Carregando pedidos...</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow 
                          key={order.id} 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleOrderClick(order.id)}
                        >
                          <TableCell className="font-medium">{order.id.split('-')[0]}</TableCell>
                          <TableCell>{order.customer.full_name || 'Sem nome'} <span className="text-xs text-gray-500">({order.customer.email})</span></TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>R$ {order.total_amount.toFixed(2)}</TableCell>
                          <TableCell>{order.items_count}</TableCell>
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
                              value={order.status}
                              onValueChange={(value) => {
                                // Create a proper MouseEvent to pass to handleUpdateStatus
                                const syntheticEvent = { 
                                  stopPropagation: () => {} 
                                } as React.MouseEvent;
                                handleUpdateStatus(order.id, value, syntheticEvent);
                              }}
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
              <CardTitle className="text-2xl">{getTodayOrders()}</CardTitle>
              <div className="p-1.5 bg-blue-50 rounded-full">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              {getTodayOrders() === 0 
                ? 'Nenhum pedido registrado hoje' 
                : `${getTodayOrders()} pedido${getTodayOrders() > 1 ? 's' : ''} registrado${getTodayOrders() > 1 ? 's' : ''} hoje`}
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Pedidos Pendentes</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{getPendingOrders()}</CardTitle>
              <div className="p-1.5 bg-amber-50 rounded-full">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              {getPendingOrders() === 0
                ? 'Nenhum pedido pendente'
                : `${getPendingOrders()} pedido${getPendingOrders() > 1 ? 's' : ''} aguardando processamento`}
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Em Trânsito</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{getShippedOrders()}</CardTitle>
              <div className="p-1.5 bg-purple-50 rounded-full">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              {getShippedOrders() === 0
                ? 'Nenhum pedido em trânsito'
                : `${getShippedOrders()} pedido${getShippedOrders() > 1 ? 's' : ''} em trânsito`}
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Entregues (7 dias)</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{getDeliveredOrdersLastWeek()}</CardTitle>
              <div className="p-1.5 bg-green-50 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              {getDeliveredOrdersLastWeek() === 0
                ? 'Nenhum pedido entregue recentemente'
                : `${getDeliveredOrdersLastWeek()} pedido${getDeliveredOrdersLastWeek() > 1 ? 's' : ''} entregues nos últimos 7 dias`}
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Orders;
