
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Order } from "@/types/order";

interface OrderStatsProps {
  orders: Order[];
}

export const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
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
  );
};
