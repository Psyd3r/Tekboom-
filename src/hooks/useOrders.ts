
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Order } from "@/types/order";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Modified query to correctly join profiles
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          created_at,
          total_amount,
          customer_id
        `);
        
      if (ordersError) throw ordersError;
      
      // Get customer profiles in a separate query
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email');
        
      if (profilesError) throw profilesError;
      
      // Create a map of profiles by ID for easy lookup
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
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
      
      // Merge order data with profile data
      const formattedOrders = ordersData?.map(order => {
        const customerProfile = profilesMap.get(order.customer_id);
        
        return {
          id: order.id,
          customer: {
            full_name: customerProfile?.full_name || 'Sem nome',
            email: customerProfile?.email || 'email@exemplo.com'
          },
          created_at: order.created_at,
          total_amount: order.total_amount,
          status: order.status as Order['status'],
          items_count: itemCounts[order.id] || 0
        };
      }) || [];
      
      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    handleUpdateStatus
  };
};
