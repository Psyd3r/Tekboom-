
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ShoppingBag, Package, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <Button variant="default">Gerar Relatório</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={ShoppingBag} 
          title="Total de Pedidos" 
          value="125" 
          description="Últimos 30 dias"
          trend={{ value: 12.5, isPositive: true }} 
        />
        <StatsCard 
          icon={DollarSign} 
          title="Receita" 
          value="R$ 8.350,75" 
          description="Últimos 30 dias"
          trend={{ value: 8.2, isPositive: true }} 
        />
        <StatsCard 
          icon={Package} 
          title="Produtos" 
          value="48" 
          description="9 com estoque baixo"
        />
        <StatsCard 
          icon={User} 
          title="Clientes" 
          value="96" 
          description="12 novos este mês"
          trend={{ value: 5.3, isPositive: true }} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Pedidos Recentes</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">#ORD-{2000 + i}</p>
                  <p className="text-sm text-gray-500">Cliente {i}</p>
                </div>
                <div>
                  <p className="font-medium text-right">R$ {(100 * i).toFixed(2)}</p>
                  <p className="text-sm text-gray-500 text-right">Há {i} hora{i !== 1 ? 's' : ''}</p>
                </div>
                <Badge variant={i % 3 === 0 ? "outline" : i % 2 === 0 ? "secondary" : "default"}>
                  {i % 3 === 0 ? "Entregue" : i % 2 === 0 ? "Em andamento" : "Novo"}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">Ver todos os pedidos</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Produtos Populares</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-100 rounded mr-3"></div>
                  <div>
                    <p className="font-medium">Produto {i}</p>
                    <p className="text-sm text-gray-500">SKU-{1000 + i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {(50 * i).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{10 * i} vendas</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">Ver todos os produtos</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

// Reimporting Badge porque parece que o componente não foi importado anteriormente
import { Badge } from "@/components/ui/badge";
