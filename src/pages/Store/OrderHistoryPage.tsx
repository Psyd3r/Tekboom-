
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, PackageOpen, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id, 
          created_at, 
          status, 
          total_amount, 
          shipping_address,
          notes
        `)
        .eq("customer_id", user.id)
        .not('status', 'eq', 'deleted')
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Fetching items count for each order
      const ordersWithItemsCount = await Promise.all(
        data.map(async (order) => {
          const { count, error: countError } = await supabase
            .from("order_items")
            .select("*", { count: "exact", head: true })
            .eq("order_id", order.id);

          return {
            ...order,
            items_count: countError ? 0 : count || 0,
            customer: {
              full_name: user.user_metadata?.full_name || '',
              email: user.email || '',
            },
          };
        })
      );

      setOrders(ordersWithItemsCount as Order[]);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Não foi possível carregar seus pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "processing":
        return "Em processamento";
      case "shipped":
        return "Enviado";
      case "delivered":
        return "Entregue";
      case "canceled":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <ClipboardList className="mr-2 h-6 w-6 text-[#1E88E5]" />
          Histórico de Pedidos
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Meus Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="p-4 bg-muted/30">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">Pedido #{order.id.substring(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Total</p>
                        <p className="text-lg font-bold">
                          R$ {order.total_amount.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Itens</p>
                        <p>{order.items_count} produtos</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Endereço de entrega</p>
                        <p className="text-sm">{order.shipping_address || "Não informado"}</p>
                      </div>
                    </div>
                    {order.notes && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Observações</p>
                        <p className="text-sm">{order.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PackageOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum pedido realizado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não fez nenhum pedido na nossa loja.
              </p>
              <Button onClick={() => navigate("/store/produtos")}>
                Ver produtos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistoryPage;
