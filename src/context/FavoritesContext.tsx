
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

type FavoriteItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (product: FavoriteItem) => void;
  removeFromFavorites: (productId: string) => void;
  isInFavorites: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  
  const localStorageKey = user ? `favorites_${user.id}` : 'favorites_guest';
  
  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem(localStorageKey);
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        localStorage.removeItem(localStorageKey);
      }
    }
  }, [localStorageKey]);
  
  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(favorites));
  }, [favorites, localStorageKey]);
  
  const addToFavorites = (product: FavoriteItem) => {
    if (!isInFavorites(product.id)) {
      setFavorites([...favorites, product]);
      toast.success("Produto adicionado aos favoritos");
    }
  };
  
  const removeFromFavorites = (productId: string) => {
    setFavorites(favorites.filter(item => item.id !== productId));
    toast.success("Produto removido dos favoritos");
  };
  
  const isInFavorites = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };
  
  const clearFavorites = () => {
    setFavorites([]);
    toast.success("Lista de favoritos limpa");
  };
  
  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        addToFavorites, 
        removeFromFavorites, 
        isInFavorites,
        clearFavorites 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
