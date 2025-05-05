import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Calendar,
  BarChart2,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Mock data for customers
const customerData = [
  {
    id: "C001",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123 - São Paulo, SP",
    orders: 5,
    totalSpent: 1250.75,
    lastOrder: "2023-05-15",
    status: "active"
  },
  {
    id: "C002",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    phone: "(21) 98765-1234",
    address: "Av. Atlântica, 456 - Rio de Janeiro, RJ",
    orders: 3,
    totalSpent: 780.50,
    lastOrder: "2023-06-02",
    status: "active"
  },
  {
    id: "C003",
    name: "Carlos Santos",
    email: "carlos.santos@example.com",
    phone: "(31) 97654-3210",
    address: "Rua das Acácias, 789 - Belo Horizonte, MG",
    orders: 1,
    totalSpent: 350.25,
    lastOrder: "2023-06-10",
    status: "inactive"
  },
  {
    id: "C004",
    name: "Ana Pereira",
    email: "ana.pereira@example.com",
    phone: "(41) 99876-5432",
    address: "Rua XV de Novembro, 1010 - Curitiba, PR",
    orders: 8,
    totalSpent: 2150.00,
    lastOrder: "2023-05-28",
    status: "active"
  },
  {
    id: "C005",
    name: "Paulo Costa",
    email: "paulo.costa@example.com",
    phone: "(51) 98765-8765",
    address: "Av. Ipiranga, 1234 - Porto Alegre, RS",
    orders: 2,
    totalSpent: 520.75,
    lastOrder: "2023-04-15",
    status: "inactive"
  }
];

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  status: "active" | "inactive";
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCustomers = customerData.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || customer.status === statusFilter;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && customer.status === "active") ||
                      (activeTab === "inactive" && customer.status === "inactive");
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCustomerClick = (customerId: string) => {
    toast("Visualizando cliente " + customerId);
  };

  const handleCreateCustomer = () => {
    toast("Criando novo cliente...");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">Gerencie e acompanhe seus clientes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateCustomer}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Todos os Clientes</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Gerenciamento de Clientes
                </CardTitle>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Buscar cliente por nome, email ou ID"
                      className="w-full md:w-[300px] pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status do Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os Status</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
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
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Total Gasto</TableHead>
                      <TableHead>Último Pedido</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <TableRow 
                          key={customer.id} 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleCustomerClick(customer.id)}
                        >
                          <TableCell className="font-medium">{customer.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">{customer.address}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {customer.phone}
                            </div>
                          </TableCell>
                          <TableCell>{customer.orders}</TableCell>
                          <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                          <TableCell>{formatDate(customer.lastOrder)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusClass(customer.status)}>
                              {customer.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  toast("Editando cliente " + customer.id);
                                }}>
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  toast("Visualizando pedidos do cliente " + customer.id);
                                }}>
                                  Ver Pedidos
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast("Cliente " + customer.id + " desativado");
                                  }}
                                >
                                  {customer.status === "active" ? "Desativar" : "Ativar"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center p-6">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                              <Users className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Nenhum cliente encontrado</h3>
                            <p className="text-gray-500 text-center max-w-md mb-4">
                              Não há clientes registrados com os filtros atuais. Você pode criar um novo cliente ou ajustar os filtros.
                            </p>
                            <Button onClick={handleCreateCustomer}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Criar Novo Cliente
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Total de Clientes</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{customerData.length}</CardTitle>
              <div className="p-1.5 bg-blue-50 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              {customerData.filter(c => c.status === "active").length} ativos, {customerData.filter(c => c.status === "inactive").length} inativos
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Clientes Ativos</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{customerData.filter(c => c.status === "active").length}</CardTitle>
              <div className="p-1.5 bg-green-50 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              {Math.round((customerData.filter(c => c.status === "active").length / customerData.length) * 100)}% do total de clientes
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-semibold text-gray-500">Total em Vendas</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">
                {formatCurrency(customerData.reduce((acc, customer) => acc + customer.totalSpent, 0))}
              </CardTitle>
              <div className="p-1.5 bg-purple-50 rounded-full">
                <BarChart2 className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              Média de {formatCurrency(customerData.reduce((acc, customer) => acc + customer.totalSpent, 0) / customerData.length)} por cliente
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Customers;
