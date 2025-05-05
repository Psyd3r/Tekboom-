
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, CheckCircle, Users } from "lucide-react";
import { Customer } from "@/hooks/useCustomers";

interface CustomerStatsProps {
  customers: Customer[];
  formatCurrency: (value: number) => string;
}

export function CustomerStats({ customers, formatCurrency }: CustomerStatsProps) {
  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const inactiveCustomers = customers.filter(c => c.status === "inactive").length;
  const totalSpent = customers.reduce((acc, customer) => acc + customer.totalSpent, 0);
  const averageSpent = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
  const activePercentage = totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase font-semibold text-gray-500">Total de Clientes</CardDescription>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{totalCustomers}</CardTitle>
            <div className="p-1.5 bg-blue-50 rounded-full">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">
            {activeCustomers} ativos, {inactiveCustomers} inativos
          </p>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase font-semibold text-gray-500">Clientes Ativos</CardDescription>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{activeCustomers}</CardTitle>
            <div className="p-1.5 bg-green-50 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">
            {activePercentage}% do total de clientes
          </p>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase font-semibold text-gray-500">Total em Vendas</CardDescription>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">
              {formatCurrency(totalSpent)}
            </CardTitle>
            <div className="p-1.5 bg-purple-50 rounded-full">
              <BarChart2 className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500">
            Média de {formatCurrency(averageSpent)} por cliente
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
