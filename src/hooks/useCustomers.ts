import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export type Customer = {
  id: string;
  name: string | null;
  email: string;
  phone?: string;
  address?: string;
  orders: number;
  totalSpent: number;
  lastOrder: string | null;
  status: "active" | "inactive";
};

export function useCustomers() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const navigate = useNavigate();

  const { data: customers = [], refetch, isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        // Get customer profiles (users with role 'customer')
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select("id, email, full_name, created_at, phone")
          .eq('role', 'customer')
          .order("created_at", { ascending: false });

        if (profilesError) {
          toast.error("Erro ao carregar clientes");
          throw profilesError;
        }
        
        if (!profiles) {
          return [];
        }
        
        // Get order data for each customer
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select("customer_id, total_amount, created_at, status")
          .not('status', 'eq', 'deleted');
          
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        }
        
        // Calculate order stats for each customer
        const customerStats: Record<string, { orders: number; totalSpent: number; lastOrder: string | null }> = {};
        
        orders?.forEach(order => {
          if (!customerStats[order.customer_id]) {
            customerStats[order.customer_id] = {
              orders: 0,
              totalSpent: 0,
              lastOrder: null
            };
          }
          
          // Increment order count
          customerStats[order.customer_id].orders++;
          
          // Add to total spent
          customerStats[order.customer_id].totalSpent += Number(order.total_amount);
          
          // Update last order date if newer
          const orderDate = new Date(order.created_at);
          if (!customerStats[order.customer_id].lastOrder || 
              new Date(customerStats[order.customer_id].lastOrder!) < orderDate) {
            customerStats[order.customer_id].lastOrder = order.created_at;
          }
        });
        
        // Format customer data
        const formattedCustomers: Customer[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          orders: customerStats[profile.id]?.orders || 0,
          totalSpent: customerStats[profile.id]?.totalSpent || 0,
          lastOrder: customerStats[profile.id]?.lastOrder || null,
          status: (customerStats[profile.id]?.orders || 0) > 0 ? "active" : "inactive"
        }));
        
        return formattedCustomers;
      } catch (error) {
        console.error("Error in customer query:", error);
        return [];
      }
    },
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = (customer.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || customer.status === statusFilter;
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && customer.status === "active") ||
                      (activeTab === "inactive" && customer.status === "inactive");
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleToggleStatus = async (id: string, currentStatus: "active" | "inactive") => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      // In a real implementation, we're updating the status in our frontend state
      // since we're calculating active/inactive based on whether they have orders or not
      toast.success(`Cliente ${currentStatus === "active" ? "desativado" : "ativado"} com sucesso`);
      
      // Find the customer and update their status
      const updatedCustomers = customers.map(customer => 
        customer.id === id ? { ...customer, status: newStatus } : customer
      );
      
      // This won't persist to the database since status is calculated based on orders
      // If you want to actually persist this status, you'd need to add a status field to profiles
      
      // Refresh the customers list
      await refetch();
    } catch (error: any) {
      toast.error("Erro ao alterar status do cliente");
      console.error("Error toggling customer status:", error);
    }
  };

  const handleViewOrders = useCallback((customerId: string) => {
    // Navigate to orders page with customer filter
    navigate(`/pedidos?customer=${customerId}`);
  }, [navigate]);

  const handleCreateCustomer = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return {
    customers,
    filteredCustomers,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    handleToggleStatus,
    handleViewOrders,
    handleCreateCustomer,
    formatCurrency,
    formatDate,
    refetch,
    isCreateDialogOpen,
    setIsCreateDialogOpen
  };
}
