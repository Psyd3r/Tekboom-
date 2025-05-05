
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserRound, PackageOpen, LogOut, Loader2 } from "lucide-react";
import { Order } from "@/types/order";
import { useNavigate } from "react-router-dom";

const CustomerProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; email: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user?.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
      });
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      toast.error("Não foi possível carregar seu perfil");
    } finally {
      setIsLoading(false);
    }
  };

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
              full_name: profile?.full_name,
              email: profile?.email || "",
            },
          };
        })
      );

      setOrders(ordersWithItemsCount as Order[]);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Não foi possível carregar seus pedidos");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast.success("Perfil atualizado com sucesso!");
      fetchProfile();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Não foi possível atualizar seu perfil");
    } finally {
      setIsUpdating(false);
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
        <h1 className="text-2xl font-bold">Minha Conta</h1>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center">
            <UserRound className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <PackageOpen className="h-4 w-4 mr-2" />
            Meus Pedidos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais abaixo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      O email não pode ser alterado.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="mt-4" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUpdating ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pedidos</CardTitle>
              <CardDescription>
                Acompanhe o status dos seus pedidos.
              </CardDescription>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerProfilePage;
