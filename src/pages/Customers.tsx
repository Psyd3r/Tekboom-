
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Filter, 
  Search,
  Users,
  UserPlus,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomersTable } from "@/components/Customers/CustomersTable";
import { CustomerStats } from "@/components/Customers/CustomerStats";
import { NewCustomerDialog } from "@/components/Customers/NewCustomerDialog";

const Customers = () => {
  const {
    filteredCustomers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    handleToggleStatus,
    handleViewOrders,
    handleCreateCustomer,
    formatCurrency,
    formatDate,
    isLoading,
    error,
    refetch,
    isCreateDialogOpen,
    setIsCreateDialogOpen
  } = useCustomers();

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
              <CustomersTable 
                customers={filteredCustomers}
                isLoading={isLoading}
                error={error}
                searchTerm={searchTerm}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getStatusClass={getStatusClass}
                onToggleStatus={handleToggleStatus}
                onViewOrders={handleViewOrders}
                onCustomerClick={handleCustomerClick}
                onCreateCustomer={handleCreateCustomer}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CustomerStats 
        customers={filteredCustomers} 
        formatCurrency={formatCurrency}
      />

      <NewCustomerDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSuccess={refetch}
      />
    </motion.div>
  );
};

export default Customers;
