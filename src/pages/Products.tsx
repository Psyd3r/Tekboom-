
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/Products/ProductCard";
import { AdminHeaderExtras } from "@/components/Layout/AdminHeaderExtras";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ProductFilter, FilterOptions } from "@/components/Products/ProductFilter";
import { useFetchCategories } from "@/hooks/category/useFetchCategories";

const Products = () => {
  const [products, setProducts] = useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    sku: string;
    category?: string;
  }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    stock: ""
  });
  
  // Fetch categories using the useFetchCategories hook
  const { data: categories = [] } = useFetchCategories();

  useEffect(() => {
    fetchProducts();
  }, [activeFilters]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('products')
        .select('*');
      
      // Apply search filter
      if (activeFilters.search) {
        query = query.or(`name.ilike.%${activeFilters.search}%,sku.ilike.%${activeFilters.search}%`);
      }
      
      // Apply category filter
      if (activeFilters.category) {
        query = query.eq('category', activeFilters.category);
      }
      
      // Apply price filters
      if (activeFilters.minPrice) {
        query = query.gte('price', parseFloat(activeFilters.minPrice));
      }
      
      if (activeFilters.maxPrice) {
        query = query.lte('price', parseFloat(activeFilters.maxPrice));
      }
      
      // Apply stock filters
      if (activeFilters.stock === 'out') {
        query = query.eq('stock', 0);
      } else if (activeFilters.stock === 'low') {
        query = query.gt('stock', 0).lte('stock', 10);
      } else if (activeFilters.stock === 'in') {
        query = query.gt('stock', 10);
      }
      
      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      if (data) {
        setProducts(data);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
      toast("Erro ao carregar produtos: " + error.message, {
        description: "Por favor, tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  // Count active filters for badge
  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="container px-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <div className="flex items-center space-x-2">
          <AdminHeaderExtras />
          <Button 
            onClick={() => setFilterOpen(true)}
            variant={activeFiltersCount > 0 ? "default" : "outline"}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button asChild>
            <Link to="/produtos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter component */}
      <ProductFilter
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        onFilter={handleApplyFilters}
        initialFilters={activeFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 h-[300px] animate-pulse bg-gray-100"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image || "https://placehold.co/300x400"}
              stock={product.stock}
              sku={product.sku}
              category={product.category}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {activeFiltersCount > 0 
              ? "Nenhum produto encontrado com os filtros aplicados." 
              : "Nenhum produto cadastrado."}
          </p>
          
          {activeFiltersCount > 0 ? (
            <Button 
              onClick={() => setActiveFilters({
                search: "",
                category: "",
                minPrice: "",
                maxPrice: "",
                stock: ""
              })}
            >
              Limpar filtros
            </Button>
          ) : (
            <Button asChild>
              <Link to="/produtos/novo">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
