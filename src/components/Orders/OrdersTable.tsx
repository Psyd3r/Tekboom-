
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package } from "lucide-react";
import { Order } from "@/types/order";

interface OrdersTableProps {
  loading: boolean;
  filteredOrders: Order[];
  getStatusClass: (status: string) => string;
  handleOrderClick: (orderId: string) => void;
  handlePrintLabel: (orderId: string, e: React.MouseEvent) => void;
  handleUpdateStatus: (orderId: string, status: string, e: React.MouseEvent) => void;
  handleCreateOrder: () => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  loading,
  filteredOrders,
  getStatusClass,
  handleOrderClick,
  handlePrintLabel,
  handleUpdateStatus,
  handleCreateOrder,
}) => {
  return (
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
  );
};
