
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
import { Package, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock order data
const orderData = [
  {
    id: "ORD-1234",
    customer: "João Silva",
    date: "2023-05-01",
    total: "R$ 235,90",
    items: 3,
    status: "processing",
  },
  {
    id: "ORD-1235",
    customer: "Maria Oliveira",
    date: "2023-05-02",
    total: "R$ 189,50",
    items: 2,
    status: "shipped",
  },
  {
    id: "ORD-1236",
    customer: "Carlos Santos",
    date: "2023-05-03",
    total: "R$ 450,00",
    items: 5,
    status: "delivered",
  },
  {
    id: "ORD-1237",
    customer: "Ana Pereira",
    date: "2023-05-03",
    total: "R$ 78,90",
    items: 1,
    status: "processing",
  },
  {
    id: "ORD-1238",
    customer: "Roberto Almeida",
    date: "2023-05-04",
    total: "R$ 325,75",
    items: 4,
    status: "pending",
  }
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();

  const filteredOrders = orderData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOrderClick = (orderId: string) => {
    // In a real app, this would navigate to order details
    toast({
      title: "Detalhes do Pedido",
      description: `Visualizando pedido ${orderId}`,
    });
  };

  const handlePrintLabel = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Etiqueta de Envio",
      description: `Gerando etiqueta para o pedido ${orderId}`,
    });
  };

  const handleUpdateStatus = (orderId: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Status Atualizado",
      description: `Pedido ${orderId} marcado como ${status}`,
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <Button>
          <Filter className="mr-2 h-4 w-4" />
          Filtros Avançados
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-[#FF5722]" />
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
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg">Estatísticas de Pedidos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm font-medium text-gray-500">Pedidos Hoje</div>
              <div className="text-2xl font-bold mt-1">5</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm font-medium text-gray-500">Pedidos Pendentes</div>
              <div className="text-2xl font-bold mt-1">12</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm font-medium text-gray-500">Em Trânsito</div>
              <div className="text-2xl font-bold mt-1">8</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm font-medium text-gray-500">Entregues (7 dias)</div>
              <div className="text-2xl font-bold mt-1">23</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
