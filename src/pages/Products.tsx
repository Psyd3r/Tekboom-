
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  Plus, 
  Search
} from "lucide-react";
import { ProductCard } from "@/components/Products/ProductCard";
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Dados de exemplo para os produtos
const mockProducts = [
  {
    id: "1",
    name: "Processador Intel Core i7",
    price: 1499.99,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3B1fGVufDB8fDB8fHww",
    stock: 15,
    sku: "CPU-I7-12700K",
    onDiscountValue: 10
  },
  {
    id: "2",
    name: "Placa de Vídeo NVIDIA RTX 4080",
    price: 5999.99,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z3B1fGVufDB8fDB8fHww",
    stock: 8,
    sku: "GPU-RTX-4080-12G",
  },
  {
    id: "3",
    name: "SSD Samsung 1TB",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1597338770339-b3923abdb198?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3NkfGVufDB8fDB8fHww",
    stock: 25,
    sku: "SSD-SAM-1TB-EVO",
    onDiscountValue: 15
  },
  {
    id: "4",
    name: "Memória RAM Corsair 32GB",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFtJTIwbWVtb3J5fGVufDB8fDB8fHww",
    stock: 12,
    sku: "RAM-COR-32GB-RGB",
  },
  {
    id: "5",
    name: "Placa-mãe ASUS ROG",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW90aGVyYm9hcmR8ZW58MHx8MHx8fDA%3D",
    stock: 5,
    sku: "MB-ASUS-Z690-ROG",
    onDiscountValue: 8
  },
  {
    id: "6",
    name: "Gabinete Corsair iCUE 5000X",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGMlMjBjYXNlfGVufDB8fDB8fHww",
    stock: 10,
    sku: "CASE-COR-5000X-RGB",
  },
];

const Products = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    lowStock: false,
  });

  const filteredProducts = mockProducts.filter(product => {
    // Filtrar por busca
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // Aplicar filtros selecionados
    if (filters.inStock && product.stock <= 0) {
      return false;
    }
    
    if (filters.onSale && !product.onDiscountValue) {
      return false;
    }
    
    if (filters.lowStock && product.stock > 10) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button asChild>
          <a href="/produtos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </a>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.inStock}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, inStock: checked }))
              }
            >
              Em estoque
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.onSale}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, onSale: checked }))
              }
            >
              Em promoção
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.lowStock}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, lowStock: checked }))
              }
            >
              Estoque baixo
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              stock={product.stock}
              sku={product.sku}
              onDiscountValue={product.onDiscountValue}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
