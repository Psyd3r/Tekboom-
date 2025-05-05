
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { CartItem, Cart } from "@/types/cart";

interface CartContextType {
  cart: Cart;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CART_STORAGE_KEY = "teekbom_cart";

const defaultCart: Cart = {
  items: [],
  total: 0,
  count: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(defaultCart);

  // Carregar o carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Salvar o carrinho no localStorage sempre que for atualizado
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product_id === product.product_id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Atualizar a quantidade se o produto já estiver no carrinho
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += product.quantity;
        newItems[existingItemIndex].total = 
          newItems[existingItemIndex].price * newItems[existingItemIndex].quantity;
        
        toast("Quantidade atualizada no carrinho");
      } else {
        // Adicionar o novo produto ao carrinho
        newItems = [...prevCart.items, { ...product, total: product.price * product.quantity }];
        toast("Produto adicionado ao carrinho");
      }

      // Calcular o novo total
      const newTotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const newCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total: newTotal,
        count: newCount,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.product_id !== productId);
      const newTotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const newCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      toast("Produto removido do carrinho");

      return {
        items: newItems,
        total: newTotal,
        count: newCount,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => {
        if (item.product_id === productId) {
          return {
            ...item,
            quantity,
            total: item.price * quantity,
          };
        }
        return item;
      });

      const newTotal = newItems.reduce((sum, item) => sum + item.total, 0);
      const newCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total: newTotal,
        count: newCount,
      };
    });
  };

  const clearCart = () => {
    setCart(defaultCart);
    toast("Carrinho limpo com sucesso");
  };

  const isInCart = (productId: string) => {
    return cart.items.some((item) => item.product_id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
