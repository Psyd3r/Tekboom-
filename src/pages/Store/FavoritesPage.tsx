
import { useFavorites } from "@/context/FavoritesContext";
import { ProductCard } from "@/components/Store/ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, XCircle, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FavoritesPage = () => {
  const { favorites, clearFavorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Heart className="mr-2 h-6 w-6 text-[#1E88E5]" />
          Meus Favoritos
        </h1>
        
        {favorites.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearFavorites}
            className="flex items-center text-sm"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Limpar favoritos
          </Button>
        )}
      </div>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              rating={4.5} // Valor padrão para demonstração
              category={product.category}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sua lista de favoritos está vazia</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6 opacity-30" />
            <p className="mb-6 text-muted-foreground">
              Você ainda não adicionou produtos à sua lista de favoritos.
              Navegue pela loja e clique no ícone de coração para adicionar.
            </p>
            <Button onClick={() => navigate("/store/produtos")} className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Ir para produtos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FavoritesPage;
