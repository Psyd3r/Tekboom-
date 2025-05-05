
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "@/components/Store/ProductCard";
import {
  ChevronDown,
  ChevronRight,
  Filter as FilterIcon,
  Grid2X2,
  List,
  X,
  Search,
  Loader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ProductListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { id: categoryId } = useParams();
  const ITEMS_PER_PAGE = 8;
  
  // Buscar produtos do Supabase
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      let query = supabase.from("products").select("*");
      
      // Filtrar por categoria, se fornecida
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
  
  // Buscar categorias do Supabase
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Buscar categorias únicas dos produtos
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Criar um conjunto para remover duplicatas
      const uniqueCategories = new Set(data.map(item => item.category));
      
      // Transformar em array de objetos com contagem
      return Array.from(uniqueCategories).map(category => ({
        id: category,
        name: category,
        count: products.filter(p => p.category === category).length
      }));
    },
    enabled: products.length > 0,
  });
  
  // Filtrar produtos com base na busca atual
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  
  // Ordenar produtos
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
  
  // Paginação
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  // Resetar página quando os filtros mudam
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortOption, priceRange[0], priceRange[1]]);

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
            <span className="text-gray-700 font-medium">{categoryId}</span>
          </>
        ) : (
          <span className="text-gray-700 font-medium">Produtos</span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          {categoryId ? categories.find(c => c.id === categoryId)?.name || categoryId : "Todos os Produtos"}
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
        {/* Filters - Desktop */}
        <div className="hidden md:block space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <h2 className="font-medium text-lg mb-4">Filtros</h2>
            
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar produtos"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Price Range */}
              <div>
                <h3 className="font-medium text-sm mb-3">Preço</h3>
                <Slider
                  value={priceRange}
                  min={0}
                  max={5000}
                  step={10}
                  onValueChange={setPriceRange}
                  className="mb-3"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(priceRange[0])}
                  </span>
                  <span className="text-sm">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(priceRange[1])}
                  </span>
                </div>
              </div>
              
              {/* Categories */}
              <Accordion type="multiple" defaultValue={["categories"]}>
                <AccordionItem value="categories">
                  <AccordionTrigger className="py-2">Categorias</AccordionTrigger>
                  <AccordionContent>
                    {categoriesLoading ? (
                      <div className="flex justify-center py-3">
                        <Loader className="h-4 w-4 animate-spin text-gray-500" />
                      </div>
                    ) : categories.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category.id}`}
                              checked={categoryId === category.id}
                              onCheckedChange={() => {
                                if (categoryId === category.id) {
                                  window.location.href = "/store/produtos";
                                } else {
                                  window.location.href = `/store/categoria/${category.id}`;
                                }
                              }}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="text-sm flex-1 cursor-pointer"
                            >
                              {category.name}
                            </label>
                            <span className="text-xs text-gray-500">({category.count})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-2">Nenhuma categoria encontrada</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button className="w-full" onClick={() => setSearchQuery("")}>Limpar Filtros</Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Filters Sidebar */}
        {mobileFiltersOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50 flex justify-end">
            <div className="w-80 bg-white h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-medium text-lg">Filtros</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar produtos"
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Preço</h3>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={5000}
                    step={10}
                    onValueChange={setPriceRange}
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(priceRange[0])}
                    </span>
                    <span className="text-sm">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(priceRange[1])}
                    </span>
                  </div>
                </div>
                
                {/* Categories */}
                <Accordion type="multiple" defaultValue={["categories"]}>
                  <AccordionItem value="categories">
                    <AccordionTrigger className="py-2">Categorias</AccordionTrigger>
                    <AccordionContent>
                      {categoriesLoading ? (
                        <div className="flex justify-center py-3">
                          <Loader className="h-4 w-4 animate-spin text-gray-500" />
                        </div>
                      ) : categories.length > 0 ? (
                        <div className="space-y-2 mt-2">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`mobile-category-${category.id}`}
                                checked={categoryId === category.id}
                                onCheckedChange={() => {
                                  if (categoryId === category.id) {
                                    window.location.href = "/store/produtos";
                                  } else {
                                    window.location.href = `/store/categoria/${category.id}`;
                                  }
                                }}
                              />
                              <label
                                htmlFor={`mobile-category-${category.id}`}
                                className="text-sm flex-1 cursor-pointer"
                              >
                                {category.name}
                              </label>
                              <span className="text-xs text-gray-500">({category.count})</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 py-2">Nenhuma categoria encontrada</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="pt-4">
                  <Button className="w-full" onClick={() => {
                    setSearchQuery("");
                    setMobileFiltersOpen(false);
                  }}>
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Product List */}
        <div className="md:col-span-3 space-y-6">
          {/* Sort and View Options */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-500 text-sm">
                Exibindo {paginatedProducts.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}-
                {Math.min(page * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} produtos
              </p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Mais Relevantes</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="name">Ordem Alfabética</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="hidden sm:flex border border-gray-200 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-r-none ${viewMode === 'grid' ? 'bg-[#F5F9FF] text-primary' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-l-none ${viewMode === 'list' ? 'bg-[#F5F9FF] text-primary' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Products */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100">
                  <div className="h-48 bg-gray-100 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-9 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'space-y-4'}>
              {paginatedProducts.map((product) => (
                viewMode === 'grid' ? (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.discount ? product.price + (product.price * product.discount / 100) : undefined}
                    image={product.image || "https://placehold.co/300x400"}
                    rating={4.5} // Valor padrão já que não temos sistema de avaliação ainda
                    isNew={false} // Podemos implementar isso depois
                    isSale={!!product.discount && product.discount > 0}
                    category={product.category || "Sem categoria"}
                  />
                ) : (
                  <div 
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden flex"
                  >
                    <div className="w-32 h-32 shrink-0 bg-gray-50">
                      <img 
                        src={product.image || "https://placehold.co/300x400"} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{product.category || "Sem categoria"}</div>
                        <Link to={`/store/produto/${product.id}`} className="block">
                          <h3 className="font-medium text-gray-800 mb-1 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(product.price)}
                          </span>
                          {product.discount && product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(product.price + (product.price * product.discount / 100))}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          asChild
                        >
                          <Link to={`/store/produto/${product.id}`}>
                            Ver produto
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500 mb-4">
                Tente ajustar os filtros ou buscar por outro termo.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setPriceRange([0, 5000]);
              }}>Limpar Filtros</Button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mx-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={page === i + 1}
                      onClick={(e) => { 
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { 
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListPage;
