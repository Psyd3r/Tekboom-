
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Phone, MoreHorizontal, UserPlus, Power, Users } from "lucide-react";
import { Customer } from "@/hooks/useCustomers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  formatCurrency: (value: number) => string;
  formatDate: (date: string | null) => string;
  getStatusClass: (status: string) => string;
  onToggleStatus: (id: string, status: "active" | "inactive") => void;
  onViewOrders: (id: string) => void;
  onCustomerClick: (id: string) => void;
  onCreateCustomer: () => void;
}

export function CustomersTable({
  customers,
  isLoading,
  error,
  searchTerm,
  formatCurrency,
  formatDate,
  getStatusClass,
  onToggleStatus,
  onViewOrders,
  onCustomerClick,
  onCreateCustomer
}: CustomersTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-gray-500">Carregando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500 flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Erro ao carregar clientes
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
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
          <TableRow>
            <TableCell colSpan={8} className="h-64 text-center">
              <div className="flex flex-col items-center justify-center p-6">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nenhum cliente encontrado</h3>
                <p className="text-gray-500 text-center max-w-md mb-4">
                  {searchTerm ? (
                    <>Não há clientes registrados com os filtros atuais. Você pode ajustar os filtros.</>
                  ) : (
                    <>Não há clientes registrados ainda. Você pode criar um novo cliente.</>
                  )}
                </p>
                <Button onClick={onCreateCustomer}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar Novo Cliente
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
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
          {customers.map((customer) => (
            <TableRow 
              key={customer.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onCustomerClick(customer.id)}
            >
              <TableCell className="font-medium">{customer.id.slice(0, 8)}...</TableCell>
              <TableCell>
                <div className="font-medium">{customer.name || "Sem nome"}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-3 w-3 mr-1" />
                  {customer.email}
                </div>
                {customer.phone && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-3 w-3 mr-1" />
                    {customer.phone}
                  </div>
                )}
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
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewOrders(customer.id);
                      }}
                      className="flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(customer.id, customer.status);
                      }}
                      className={`flex items-center ${
                        customer.status === "active" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      <Power className="mr-2 h-4 w-4" />
                      {customer.status === "active" ? "Desativar" : "Ativar"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
