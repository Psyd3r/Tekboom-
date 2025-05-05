
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Settings as SettingsIcon, CreditCard, Truck, Package, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações Salvas",
      description: "Suas configurações foram salvas com sucesso!",
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <Button onClick={handleSave}>
          <SettingsIcon className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Pagamentos</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Envio</span>
          </TabsTrigger>
          <TabsTrigger value="coupons" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Cupons</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-[#FF5722]" />
                Métodos de Pagamento
              </CardTitle>
              <CardDescription>Configure os métodos de pagamento disponíveis para sua loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <PaymentMethodForm 
                title="Cartão de Crédito" 
                description="Configure as bandeiras e parcelas aceitas pela loja"
              />
              
              <PaymentMethodForm 
                title="PIX" 
                description="Configure as opções para pagamento via PIX"
              />
              
              <PaymentMethodForm 
                title="Boleto Bancário" 
                description="Configure as opções para pagamento via boleto"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-[#FF5722]" />
                Métodos de Envio
              </CardTitle>
              <CardDescription>Configure as opções de envio disponíveis para sua loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <ShippingMethodForm 
                title="Correios - PAC" 
                description="Entrega econômica pelos Correios"
              />
              
              <ShippingMethodForm 
                title="Correios - SEDEX" 
                description="Entrega rápida pelos Correios"
              />
              
              <ShippingMethodForm 
                title="Transportadora" 
                description="Entrega por transportadora parceira"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5 text-[#FF5722]" />
                Cupons de Desconto
              </CardTitle>
              <CardDescription>Gerencie os cupons de desconto da sua loja</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <CouponForm />
                
                <h3 className="font-semibold text-lg mt-8 mb-4">Cupons Ativos</h3>
                <div className="space-y-4">
                  <CouponCard 
                    code="BEMVINDO10" 
                    discount="10%" 
                    expiration="31/12/2023" 
                    usage="120/200"
                  />
                  <CouponCard 
                    code="FRETEGRATIS" 
                    discount="Frete Grátis" 
                    expiration="15/06/2023" 
                    usage="85/100"
                  />
                  <CouponCard 
                    code="BLACKFRIDAY" 
                    discount="20%" 
                    expiration="30/11/2023" 
                    usage="0/500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Payment Method Form Component
const PaymentMethodForm = ({ title, description }: { title: string; description: string }) => {
  const [enabled, setEnabled] = useState(true);
  
  return (
    <div className="space-y-4 pb-6 border-b last:border-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center">
          <Label htmlFor={`enable-${title}`} className="mr-2">Ativo</Label>
          <input 
            type="checkbox" 
            id={`enable-${title}`} 
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            className="h-4 w-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF5722]"
          />
        </div>
      </div>
      
      {enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor={`api-key-${title}`}>Chave da API</Label>
            <Input id={`api-key-${title}`} placeholder="Insira sua chave de API" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`secret-${title}`}>Chave Secreta</Label>
            <Input id={`secret-${title}`} type="password" placeholder="Insira sua chave secreta" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`max-installments-${title}`}>Número Máximo de Parcelas</Label>
            <Select defaultValue="6">
              <SelectTrigger id={`max-installments-${title}`}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x (à vista)</SelectItem>
                <SelectItem value="3">3x sem juros</SelectItem>
                <SelectItem value="6">6x sem juros</SelectItem>
                <SelectItem value="12">12x com juros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

// Shipping Method Form Component
const ShippingMethodForm = ({ title, description }: { title: string; description: string }) => {
  const [enabled, setEnabled] = useState(true);
  
  return (
    <div className="space-y-4 pb-6 border-b last:border-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center">
          <Label htmlFor={`enable-${title}`} className="mr-2">Ativo</Label>
          <input 
            type="checkbox" 
            id={`enable-${title}`} 
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            className="h-4 w-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF5722]"
          />
        </div>
      </div>
      
      {enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor={`fee-${title}`}>Taxa de Envio</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">R$</span>
              <Input id={`fee-${title}`} className="pl-8" placeholder="0,00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`delivery-time-${title}`}>Prazo de Entrega</Label>
            <div className="flex items-center gap-2">
              <Input id={`delivery-time-${title}`} placeholder="3" />
              <span className="text-sm">dias úteis</span>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`free-shipping-${title}`}>Frete Grátis acima de</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">R$</span>
              <Input id={`free-shipping-${title}`} className="pl-8" placeholder="150,00" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Coupon Form Component
const CouponForm = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border">
      <h3 className="font-semibold mb-4">Criar Novo Cupom</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="coupon-code">Código do Cupom</Label>
          <Input id="coupon-code" placeholder="Ex: DESCONTO10" className="uppercase" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coupon-type">Tipo de Desconto</Label>
          <Select>
            <SelectTrigger id="coupon-type">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Porcentagem (%)</SelectItem>
              <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
              <SelectItem value="shipping">Frete Grátis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coupon-value">Valor do Desconto</Label>
          <Input id="coupon-value" placeholder="Ex: 10" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coupon-expiration">Data de Expiração</Label>
          <Input id="coupon-expiration" type="date" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coupon-limit">Limite de Uso</Label>
          <Input id="coupon-limit" type="number" placeholder="Ex: 100" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coupon-min-purchase">Valor Mínimo de Compra</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">R$</span>
            <Input id="coupon-min-purchase" className="pl-8" placeholder="0,00" />
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2 pt-2">
          <Button>Criar Cupom</Button>
        </div>
      </div>
    </div>
  );
};

// Coupon Card Component
const CouponCard = ({ 
  code, 
  discount, 
  expiration, 
  usage 
}: { 
  code: string; 
  discount: string; 
  expiration: string; 
  usage: string 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border rounded-md shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <div className="bg-[#2C2C2C] text-white px-3 py-2 rounded font-mono text-sm">
          {code}
        </div>
        <div>
          <div className="font-semibold">{discount} de desconto</div>
          <div className="text-sm text-gray-500">Expira em: {expiration}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <div className="text-sm text-gray-500">
          Uso: <span className="font-medium">{usage}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Editar</Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:border-red-700">
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
