
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Check, Loader2, CreditCard, Landmark, Truck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Endereço é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  postalCode: z.string().min(8, "CEP inválido").max(9),
  paymentMethod: z.enum(["credit", "bank", "pix"]),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<"standard" | "express">("standard");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.email?.split("@")[0] || "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      paymentMethod: "credit",
      notes: "",
    },
  });

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular o valor do frete
  const getShippingCost = () => {
    return selectedShipping === "express" ? 20 : 10;
  };

  // Calcular o valor total
  const getTotalCost = () => {
    return cart.total + getShippingCost();
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cart.items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error("Você precisa estar logado para finalizar a compra");
        navigate("/store/login");
        return;
      }

      const shippingAddress = `${data.address}, ${data.city}, ${data.state}, ${data.postalCode}`;

      // Criar o pedido no Supabase
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          total_amount: getTotalCost(),
          shipping_address: shippingAddress,
          notes: data.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(orderError.message);
      }

      // Adicionar os itens do pedido
      const orderItems = cart.items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw new Error(itemsError.message);
      }

      // Limpar o carrinho e redirecionar para a página de confirmação
      clearCart();
      toast.success("Pedido realizado com sucesso!");
      
      // Simular processamento de pagamento
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/store");
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Erro ao processar o pedido. Tente novamente.");
      console.error("Erro ao processar pedido:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout form */}
        <div className="col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Informações Pessoais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Shipping Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Endereço de Entrega</h2>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, número, complemento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="Estado" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Opções de entrega</h3>
                  
                  <div className="space-y-3">
                    <div 
                      className={`flex justify-between items-center border p-3 rounded-md cursor-pointer ${
                        selectedShipping === "standard" ? "border-primary" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedShipping("standard")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full w-5 h-5 flex items-center justify-center ${
                          selectedShipping === "standard" ? "bg-primary text-white" : "border border-gray-300"
                        }`}>
                          {selectedShipping === "standard" && <Check size={12} />}
                        </div>
                        <div>
                          <p className="font-medium">Entrega Padrão</p>
                          <p className="text-sm text-gray-500">3-5 dias úteis</p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency(10)}</p>
                    </div>
                    
                    <div 
                      className={`flex justify-between items-center border p-3 rounded-md cursor-pointer ${
                        selectedShipping === "express" ? "border-primary" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedShipping("express")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full w-5 h-5 flex items-center justify-center ${
                          selectedShipping === "express" ? "bg-primary text-white" : "border border-gray-300"
                        }`}>
                          {selectedShipping === "express" && <Check size={12} />}
                        </div>
                        <div>
                          <p className="font-medium">Entrega Expressa</p>
                          <p className="text-sm text-gray-500">1-2 dias úteis</p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency(20)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Forma de Pagamento</h2>
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <div className={`border rounded-md p-4 cursor-pointer ${field.value === "credit" ? "border-primary" : "border-gray-200"}`}>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="credit" />
                              </FormControl>
                              <FormLabel className="cursor-pointer flex items-center gap-2">
                                <CreditCard size={18} />
                                <span>Cartão de Crédito</span>
                              </FormLabel>
                            </FormItem>
                          </div>
                          
                          <div className={`border rounded-md p-4 cursor-pointer ${field.value === "bank" ? "border-primary" : "border-gray-200"}`}>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="bank" />
                              </FormControl>
                              <FormLabel className="cursor-pointer flex items-center gap-2">
                                <Landmark size={18} />
                                <span>Boleto Bancário</span>
                              </FormLabel>
                            </FormItem>
                          </div>
                          
                          <div className={`border rounded-md p-4 cursor-pointer ${field.value === "pix" ? "border-primary" : "border-gray-200"}`}>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="pix" />
                              </FormControl>
                              <FormLabel className="cursor-pointer flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M23.5 8.5L8.5 23.5M8.5 8.5L23.5 23.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>PIX</span>
                              </FormLabel>
                            </FormItem>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Observações do Pedido</h2>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Instruções especiais para entrega, etc." 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Submit Button - Mobile only */}
              <div className="lg:hidden">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando
                    </>
                  ) : (
                    'Finalizar Compra'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Order summary */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4">
              {/* Order items summary */}
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex-grow">
                      {item.name}
                      {item.quantity > 1 && <span className="text-gray-500"> (x{item.quantity})</span>}
                    </span>
                    <span className="ml-4 font-medium">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Order calculations */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Frete:</span>
                  <span className="flex items-center gap-1">
                    <Truck size={14} />
                    {formatCurrency(getShippingCost())}
                  </span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-base font-medium pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(getTotalCost())}</span>
                </div>
              </div>
            </div>
            
            {/* Hidden on mobile */}
            <div className="hidden lg:block mt-6">
              <Button 
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando
                  </>
                ) : (
                  'Finalizar Compra'
                )}
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-4">
              Ao finalizar a compra, você concorda com os Termos de Serviço e a Política de Privacidade.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
