
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Filter, 
  Plus, 
  Search,
  Loader2,
  ListFilter,
  PackageOpen,
  ShoppingCart,
  RefreshCw
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  sku: string;
  discount: number | null;
  description: string | null;
  category: string | null;
}

const Products = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    lowStock: false,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    onSale: 0
  });
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setProducts(data || []);
      
      // Calculate stats
      if (data) {
        setStats({
          total: data.length,
          lowStock: data.filter(p => p.stock > 0 && p.stock <= 10).length,
          outOfStock: data.filter(p => p.stock <= 0).length,
          onSale: data.filter(p => p.discount && p.discount > 0).length
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = () => {
    // Refresh product list after deletion
    fetchProducts();
  };

  const filteredProducts = products.filter(product => {
    // Filter by search
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // Apply selected filters
    if (filters.inStock && product.stock <= 0) {
      return false;
    }
    
    if (filters.onSale && (!product.discount || product.discount <= 0)) {
      return false;
    }
    
    if (filters.lowStock && product.stock > 10) {
      return false;
    }
    
    return true;
  });

  // Group products by category for the category view
  const productsByCategory = filteredProducts.reduce<Record<string, Product[]>>((acc, product) => {
    const category = product.category || "Sem categoria";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const renderProductsGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image || "https://images.unsplash.com/photo-1597338770339-b3923abdb198?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3NkfGVufDB8fDB8fHww"}
            stock={product.stock}
            sku={product.sku}
            onDiscountValue={product.discount || undefined}
            onDelete={handleDeleteProduct}
          />
        </motion.div>
      ))}
    </div>
  );

  const renderCategoriesView = () => (
    <div className="space-y-8">
      {Object.entries(productsByCategory).map(([category, products]) => (
        <Card key={category} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <PackageOpen className="h-5 w-5" />
              {category}
              <Badge variant="outline" className="ml-2">{products.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image || "https://images.unsplash.com/photo-1597338770339-b3923abdb198?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3NkfGVufDB8fDB8fHww"}
                    stock={product.stock}
                    sku={product.sku}
                    onDiscountValue={product.discount || undefined}
                    onDelete={handleDeleteProduct}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderNoProducts = () => (
    <Card className="border-dashed border-2 border-gray-200 p-8">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-medium mb-2">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {search || filters.inStock || filters.lowStock || filters.onSale 
            ? "Nenhum produto corresponde aos filtros aplicados. Tente ajustar seus critérios de busca ou remover alguns filtros."
            : "Você ainda não cadastrou nenhum produto. Clique no botão abaixo para adicionar seu primeiro produto."}
        </p>
        {search || filters.inStock || filters.lowStock || filters.onSale ? (
          <Button variant="outline" onClick={() => {
            setSearch("");
            setFilters({ inStock: false, onSale: false, lowStock: false });
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        ) : (
          <Button asChild>
            <Link to="/produtos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de produtos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <PackageOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estoque baixo</p>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
              </div>
              <div className="bg-amber-500/10 p-2 rounded-full">
                <Loader2 className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sem estoque</p>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
              </div>
              <div className="bg-red-500/10 p-2 rounded-full">
                <PackageOpen className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em promoção</p>
                <p className="text-2xl font-bold">{stats.onSale}</p>
              </div>
              <div className="bg-green-500/10 p-2 rounded-full">
                <ShoppingCart className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Title and actions row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button asChild>
          <Link to="/produtos/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
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
              {(filters.inStock || filters.onSale || filters.lowStock) && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {(filters.inStock ? 1 : 0) + 
                   (filters.onSale ? 1 : 0) + 
                   (filters.lowStock ? 1 : 0)}
                </Badge>
              )}
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

      {/* Content tabs */}
      <Tabs defaultValue="grid" className="w-full" onValueChange={(value) => setCurrentView(value as "grid" | "list")}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grade</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
          
          {filteredProducts.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Exibindo {filteredProducts.length} {filteredProducts.length === 1 ? "produto" : "produtos"}
              {(search || filters.inStock || filters.onSale || filters.lowStock) && " com os filtros aplicados"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          renderNoProducts()
        ) : (
          <>
            <TabsContent value="grid" className="mt-0">
              {renderProductsGrid()}
            </TabsContent>
            <TabsContent value="categories" className="mt-0">
              {renderCategoriesView()}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Products;
