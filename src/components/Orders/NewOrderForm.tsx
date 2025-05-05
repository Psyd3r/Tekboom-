
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Package, Trash, Plus, User, MapPin } from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
  image: string | null;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  product: Product | null;
}

export const NewOrderForm = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch customers
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'customer');
          
        if (error) throw error;
        setCustomers(data || []);
      } catch (error: any) {
        console.error('Error fetching customers:', error.message);
        toast.error('Erro ao carregar clientes');
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) throw error;
        setProducts(data || []);
      } catch (error: any) {
        console.error('Error fetching products:', error.message);
        toast.error('Erro ao carregar produtos');
      }
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1, product: null }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    
    if (field === 'product_id') {
      const selectedProduct = products.find(p => p.id === value);
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        product: selectedProduct || null
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
    }
    
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      if (item.product) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      toast.error("Selecione um cliente para o pedido");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Adicione pelo menos um produto ao pedido");
      return;
    }
    
    for (const item of items) {
      if (!item.product_id) {
        toast.error("Todos os itens precisam ter um produto selecionado");
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_id: selectedCustomer,
            status: status,
            shipping_address: shippingAddress,
            notes: notes,
            total_amount: calculateTotal()
          }
        ])
        .select('id')
        .single();
        
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      toast.success("Pedido criado com sucesso!");
      navigate('/pedidos');
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error('Erro ao criar pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-md">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-xl flex items-center">
            <Package className="mr-2 h-5 w-5 text-[#1E88E5]" />
            Novo Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <div className="font-medium text-sm flex items-center mb-2">
              <User className="mr-2 h-4 w-4 text-[#546E7A]" />
              Cliente
            </div>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.full_name} ({customer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shipping Address */}
          <div className="space-y-2">
            <div className="font-medium text-sm flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-[#546E7A]" />
              Endereço de Entrega
            </div>
            <Textarea 
              placeholder="Digite o endereço de entrega completo"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>

          {/* Product Items */}
          <div className="space-y-4">
            <div className="font-medium text-sm flex items-center">
              Itens do Pedido
            </div>
            
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 p-3 border rounded-md bg-gray-50">
                    <div className="flex-grow">
                      <Select 
                        value={item.product_id} 
                        onValueChange={(value) => updateItem(index, 'product_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} (R$ {product.price.toFixed(2)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-32">
                      <Input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="w-full md:w-28 flex items-center justify-between md:justify-end">
                      <span className="md:mr-2">
                        R$ {item.product ? (item.product.price * item.quantity).toFixed(2) : '0.00'}
                      </span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(index)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-md">
                <p className="text-gray-500">Nenhum item adicionado</p>
              </div>
            )}

            <Button 
              type="button" 
              variant="outline" 
              onClick={addItem} 
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar Item
            </Button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total do Pedido:</span>
              <span>R$ {calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Order Status */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Status do Pedido</div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Observações</div>
            <Textarea 
              placeholder="Adicione observações ou instruções especiais" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/pedidos')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[#1E88E5] hover:bg-[#1976D2]"
          >
            {loading ? "Criando..." : "Criar Pedido"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
