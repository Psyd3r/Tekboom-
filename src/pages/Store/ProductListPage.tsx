
import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Filter as FilterIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { EmptyCategoryState } from "@/components/Store/EmptyCategoryState";
import { useFetchCategories } from "@/hooks/category/useFetchCategories";

// Import our new components
import { DesktopFilters } from "@/components/Store/ProductList/DesktopFilters";
import { MobileFilters } from "@/components/Store/ProductList/MobileFilters";
import { ProductSorting } from "@/components/Store/ProductList/ProductSorting";
import { ProductsDisplay } from "@/components/Store/ProductList/ProductsDisplay";
import { ProductPagination } from "@/components/Store/ProductList/ProductPagination";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  category: string;
  discount?: number;
  description?: string;
}

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || "";
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [sortOption, setSortOption] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { id: categoryId } = useParams();
  const ITEMS_PER_PAGE = 8;
  
  // Update local search query when URL search param changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  // Fetch products from Supabase
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", categoryId, searchQuery],
    queryFn: async () => {
      let query = supabase.from("products").select("*");
      
      // Filter by category if provided
      if (categoryId) {
        query = query.eq("category", categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    },
  });
  
  // Fetch categories using the useFetchCategories hook
  const { data: allCategories = [], isLoading: categoriesLoading } = useFetchCategories();
  
  // Filter only categories that have products
  const categories = allCategories.filter(category => {
    return category.productCount && category.productCount > 0;
  });
  
  // Filter products based on current search and price range
  const filteredProducts = products
    .filter(product => 
      searchQuery ? 
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())))
        : true
    )
    .filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  // Pagination
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  
  // Display range for sorting component
  const displayRange = {
    start: filteredProducts.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0,
    end: Math.min(page * ITEMS_PER_PAGE, filteredProducts.length),
    total: filteredProducts.length
  };
  
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [localSearchQuery, sortOption, priceRange[0], priceRange[1]]);

  // Check if we're viewing a category that has no products
  const isEmptyCategory = categoryId && products.length === 0 && !isLoading;

  // Find current category name from ID
  const getCurrentCategoryName = () => {
    if (!categoryId) return "";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Categoria";
  };

  // Handler to clear filters
  const handleClearFilters = () => {
    setLocalSearchQuery("");
    setPriceRange([0, 5000]);
  };
  
  // Get page title based on search or category
  const getPageTitle = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`;
    }
    return categoryId ? getCurrentCategoryName() : "Todos os Produtos";
  };
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-2 text-gray-500">
        <Link to="/store" className="hover:text-primary">Início</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        {categoryId ? (
          <>
            <Link to="/store/produtos" className="hover:text-primary">Produtos</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-700 font-medium">{getCurrentCategoryName()}</span>
          </>
        ) : searchQuery ? (
          <>
            <Link to="/store/produtos" className="hover:text-primary">Produtos</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-700 font-medium">Pesquisa</span>
          </>
        ) : (
          <span className="text-gray-700 font-medium">Produtos</span>
        )}
      </div>
      
      {isEmptyCategory ? (
        // Render empty category state
        <EmptyCategoryState categoryName={getCurrentCategoryName()} />
      ) : (
        // Render normal product listing UI
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
              {getPageTitle()}
            </h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="md:hidden flex items-center gap-2"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FilterIcon className="h-4 w-4" />
              Filtros
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Desktop Filters */}
            <DesktopFilters
              searchQuery={localSearchQuery}
              setSearchQuery={setLocalSearchQuery}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoryId={categoryId}
            />
            
            {/* Mobile Filters */}
            <MobileFilters
              isOpen={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
              searchQuery={localSearchQuery}
              setSearchQuery={setLocalSearchQuery}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={categories}
              categoriesLoading={categoriesLoading}
              categoryId={categoryId}
            />
            
            {/* Product List */}
            <div className="md:col-span-3 space-y-6">
              {/* Sort and View Options */}
              <ProductSorting
                sortOption={sortOption}
                setSortOption={setSortOption}
                viewMode={viewMode}
                setViewMode={setViewMode}
                displayRange={displayRange}
              />
              
              {/* Products Display */}
              <ProductsDisplay
                isLoading={isLoading}
                products={paginatedProducts}
                viewMode={viewMode}
                onClearFilters={handleClearFilters}
              />
              
              {/* Pagination */}
              <ProductPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ProductListPage;
