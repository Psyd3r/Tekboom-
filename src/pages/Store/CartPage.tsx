
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Trash, 
  MinusCircle, 
  PlusCircle, 
  RefreshCw,
  ShoppingBag, 
  ArrowRight 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Simulação de aplicação de cupom
    alert(`Cupom "${couponCode}" não é válido.`);
    setCouponCode("");
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-medium mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-6">
            Adicione produtos para continuar a compra
          </p>
          <Button asChild>
            <Link to="/store/produtos">Explorar produtos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="font-medium">Itens ({cart.count})</h2>
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-gray-500">
                <RefreshCw size={14} className="mr-1" />
                Limpar
              </Button>
            </div>
            
            <div className="divide-y">
              {cart.items.map((item) => (
                <motion.div 
                  key={item.id}
                  className="p-4 flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Product image */}
                  <Link to={`/store/produto/${item.product_id}`} className="flex-shrink-0">
                    <img 
                      src={item.image || "https://placehold.co/100x100"} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                    />
                  </Link>
                  
                  {/* Product details */}
                  <div className="flex-grow">
                    <Link 
                      to={`/store/produto/${item.product_id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="text-gray-500 text-sm mt-1">
                      {formatCurrency(item.price)} por unidade
                    </div>
                  </div>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8"
                    >
                      <MinusCircle size={16} />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <PlusCircle size={16} />
                    </Button>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <div className="font-medium">{formatCurrency(item.total)}</div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemove(item.product_id)}
                      className="text-gray-500 hover:text-red-500 h-8 w-8 mt-1"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-4">Resumo do pedido</h2>
            
            {/* Coupon code */}
            <div className="mb-4 flex gap-2">
              <Input
                placeholder="Cupom de desconto"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-grow"
              />
              <Button 
                variant="outline" 
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim()}
              >
                Aplicar
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            {/* Order calculations */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Frete:</span>
                <span>Cálculo no checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Impostos:</span>
                <span>Cálculo no checkout</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between text-base font-medium pt-2">
                <span>Total estimado:</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6"
              onClick={() => navigate("/store/checkout")}
            >
              Finalizar compra
              <ArrowRight size={16} className="ml-2" />
            </Button>
            
            <div className="mt-4 text-center">
              <Button variant="link" asChild>
                <Link to="/store/produtos">Continuar comprando</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
