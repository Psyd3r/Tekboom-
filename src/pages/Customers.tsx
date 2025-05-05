
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Users, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// Mock customer data
const customerData = [
  {
    id: "CUST-001",
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    orders: 5,
    totalSpent: "R$ 850,90",
    lastOrder: "2023-05-01",
    addresses: [
      {
        street: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zipcode: "01234-567"
      }
    ]
  },
  {
    id: "CUST-002",
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    orders: 3,
    totalSpent: "R$ 325,50",
    lastOrder: "2023-04-28",
    addresses: [
      {
        street: "Avenida Brasil, 789",
        city: "Rio de Janeiro",
        state: "RJ",
        zipcode: "20000-000"
      }
    ]
  },
  {
    id: "CUST-003",
    name: "Carlos Santos",
    email: "carlos.santos@exemplo.com",
    orders: 8,
    totalSpent: "R$ 1.250,75",
    lastOrder: "2023-05-03",
    addresses: [
      {
        street: "Rua dos Pinheiros, 456",
        city: "Curitiba",
        state: "PR",
        zipcode: "80000-000"
      }
    ]
  },
  {
    id: "CUST-004",
    name: "Ana Pereira",
    email: "ana.pereira@exemplo.com",
    orders: 2,
    totalSpent: "R$ 178,90",
    lastOrder: "2023-04-15",
    addresses: [
      {
        street: "Rua das Palmeiras, 567",
        city: "Belo Horizonte",
        state: "MG",
        zipcode: "30000-000"
      }
    ]
  },
  {
    id: "CUST-005",
    name: "Roberto Almeida",
    email: "roberto.almeida@exemplo.com",
    orders: 6,
    totalSpent: "R$ 975,25",
    lastOrder: "2023-05-02",
    addresses: [
      {
        street: "Avenida Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        zipcode: "01310-100"
      }
    ]
  }
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredCustomers = customerData.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerClick = (customerId: string) => {
    // In a real app, this would navigate to customer details
    toast({
      title: "Detalhes do Cliente",
      description: `Visualizando cliente ${customerId}`,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#FF5722]" />
                Gerenciamento de Clientes
              </CardTitle>
              <CardDescription className="mt-1">
                Visualize e gerencie todos os clientes cadastrados
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar por nome ou email"
                className="w-full md:w-[300px] pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Último Pedido</TableHead>
                  <TableHead>Endereço</TableHead>
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
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{customer.totalSpent}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" /> 
                        {formatDate(customer.lastOrder)}
                      </TableCell>
                      <TableCell>
                        {customer.addresses.length > 0 && (
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                Ver endereço
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Endereço de Entrega</h4>
                                <p className="text-sm">{customer.addresses[0].street}</p>
                                <p className="text-sm">
                                  {customer.addresses[0].city}, {customer.addresses[0].state} - {customer.addresses[0].zipcode}
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clientes Frequentes</CardTitle>
            <CardDescription>Top 5 clientes com mais compras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerData
                .sort((a, b) => b.orders - a.orders)
                .slice(0, 5)
                .map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between pb-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#FF5722] text-white h-8 w-8 rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{customer.orders} pedidos</div>
                      <div className="text-sm text-gray-500">{customer.totalSpent}</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Clientes</CardTitle>
            <CardDescription>Visão geral dos clientes cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-gray-500">Total de Clientes</div>
                <div className="text-2xl font-bold mt-1">127</div>
                <div className="text-xs text-green-600 mt-1">+12% este mês</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-gray-500">Novos Clientes (30 dias)</div>
                <div className="text-2xl font-bold mt-1">18</div>
                <div className="text-xs text-green-600 mt-1">+5% em relação ao mês anterior</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-gray-500">Ticket Médio</div>
                <div className="text-2xl font-bold mt-1">R$ 185,50</div>
                <div className="text-xs text-red-600 mt-1">-2% em relação ao mês anterior</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-gray-500">Taxa de Retorno</div>
                <div className="text-2xl font-bold mt-1">68%</div>
                <div className="text-xs text-green-600 mt-1">+3% em relação ao mês anterior</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Customers;
