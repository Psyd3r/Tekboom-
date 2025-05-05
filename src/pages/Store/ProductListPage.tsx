import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/Store/ProductCard";
import {
  ChevronDown,
  ChevronRight,
  Filter as FilterIcon,
  Grid2X2,
  List,
  X,
  Search
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

// Mock product data for demonstration
const products = [
  {
    id: "1",
    name: "Smartphone XYZ Pro Max",
    price: 1999.99,
    originalPrice: 2499.99,
    image: "https://placehold.co/300x400",
    rating: 4.5,
    isNew: true,
    isSale: true,
    category: "Eletrônicos"
  },
  {
    id: "2",
    name: "Notebook Ultra Slim 15\"",
    price: 3599.99,
    originalPrice: 4099.99,
    image: "https://placehold.co/300x400",
    rating: 4.8,
    isNew: false,
    isSale: true,
    category: "Informática"
  },
  {
    id: "3",
    name: "Smartwatch Series 7",
    price: 899.99,
    image: "https://placehold.co/300x400",
    rating: 4.2,
    isNew: true,
    isSale: false,
    category: "Acessórios"
  },
  {
    id: "4",
    name: "Fone de Ouvido Bluetooth",
    price: 199.99,
    originalPrice: 299.99,
    image: "https://placehold.co/300x400",
    rating: 4.0,
    isNew: false,
    isSale: true,
    category: "Acessórios"
  },
  {
    id: "5",
    name: "Câmera Digital 4K",
    price: 2499.99,
    image: "https://placehold.co/300x400",
    rating: 4.7,
    isNew: true,
    isSale: false,
    category: "Eletrônicos"
  },
  {
    id: "6",
    name: "Caixa de Som Bluetooth",
    price: 299.99,
    image: "https://placehold.co/300x400",
    rating: 4.3,
    isNew: false,
    isSale: false,
    category: "Áudio"
  },
  {
    id: "7",
    name: "Tablet Pro 11\"",
    price: 1899.99,
    originalPrice: 2299.99,
    image: "https://placehold.co/300x400",
    rating: 4.6,
    isNew: false,
    isSale: true,
    category: "Informática"
  },
  {
    id: "8",
    name: "Mouse Gamer",
    price: 149.99,
    image: "https://placehold.co/300x400",
    rating: 4.1,
    isNew: true,
    isSale: false,
    category: "Periféricos"
  },
  {
    id: "9",
    name: "Teclado Mecânico",
    price: 399.99,
    originalPrice: 499.99,
    image: "https://placehold.co/300x400",
    rating: 4.9,
    isNew: false,
    isSale: true,
    category: "Periféricos"
  },
  {
    id: "10",
    name: "Monitor 27\" 4K",
    price: 1599.99,
    image: "https://placehold.co/300x400",
    rating: 4.4,
    isNew: true,
    isSale: false,
    category: "Informática"
  },
  {
    id: "11",
    name: "Carregador Portátil",
    price: 129.99,
    image: "https://placehold.co/300x400",
    rating: 4.0,
    isNew: false,
    isSale: false,
    category: "Acessórios"
  },
  {
    id: "12",
    name: "SSD 1TB",
    price: 599.99,
    originalPrice: 699.99,
    image: "https://placehold.co/300x400",
    rating: 4.8,
    isNew: false,
    isSale: true,
    category: "Informática"
  }
];

const categoryFilters = [
  { id: "eletronicos", name: "Eletrônicos", count: 42 },
  { id: "informatica", name: "Informática", count: 38 },
  { id: "audio", name: "Áudio", count: 24 },
  { id: "perifericos", name: "Periféricos", count: 56 },
  { id: "acessorios", name: "Acessórios", count: 94 }
];

const brandFilters = [
  { id: "techxyz", name: "TechXYZ", count: 28 },
  { id: "ultragear", name: "UltraGear", count: 32 },
  { id: "soundmax", name: "SoundMax", count: 19 },
  { id: "digitech", name: "DigiTech", count: 47 },
  { id: "powertech", name: "PowerTech", count: 23 }
];

const ProductListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  
  const filteredProducts = products.slice((page - 1) * 8, page * 8);

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
        <span className="text-gray-700 font-medium">Produtos</span>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Todos os Produtos</h1>
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
                    <div className="space-y-2 mt-2">
                      {categoryFilters.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox id={`category-${category.id}`} />
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Brands */}
              <Accordion type="multiple">
                <AccordionItem value="brands">
                  <AccordionTrigger className="py-2">Marcas</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 mt-2">
                      {brandFilters.map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2">
                          <Checkbox id={`brand-${brand.id}`} />
                          <label
                            htmlFor={`brand-${brand.id}`}
                            className="text-sm flex-1 cursor-pointer"
                          >
                            {brand.name}
                          </label>
                          <span className="text-xs text-gray-500">({brand.count})</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Other Filters */}
              <Accordion type="multiple">
                <AccordionItem value="availability">
                  <AccordionTrigger className="py-2">Disponibilidade</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" />
                        <label htmlFor="in-stock" className="text-sm cursor-pointer">
                          Em estoque
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="out-of-stock" />
                        <label htmlFor="out-of-stock" className="text-sm cursor-pointer">
                          Fora de estoque
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button className="w-full">Aplicar Filtros</Button>
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
                      <div className="space-y-2 mt-2">
                        {categoryFilters.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox id={`mobile-category-${category.id}`} />
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                {/* Brands */}
                <Accordion type="multiple">
                  <AccordionItem value="brands">
                    <AccordionTrigger className="py-2">Marcas</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 mt-2">
                        {brandFilters.map((brand) => (
                          <div key={brand.id} className="flex items-center space-x-2">
                            <Checkbox id={`mobile-brand-${brand.id}`} />
                            <label
                              htmlFor={`mobile-brand-${brand.id}`}
                              className="text-sm flex-1 cursor-pointer"
                            >
                              {brand.name}
                            </label>
                            <span className="text-xs text-gray-500">({brand.count})</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="pt-4">
                  <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
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
              <p className="text-gray-500 text-sm">Exibindo 1-8 de 12 produtos</p>
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
                  <SelectItem value="rating">Melhor Avaliação</SelectItem>
                  <SelectItem value="newest">Mais Recentes</SelectItem>
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
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                viewMode === 'grid' ? (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    rating={product.rating}
                    isNew={product.isNew}
                    isSale={product.isSale}
                    category={product.category}
                  />
                ) : (
                  <div 
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden flex"
                  >
                    <div className="w-32 h-32 shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                        <Link to={`/store/produto/${product.id}`} className="block">
                          <h3 className="font-medium text-gray-800 mb-1 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center mb-2">
                          {/* Rating stars would go here */}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{
                            new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(product.price)
                          }</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{
                              new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(product.originalPrice)
                            }</span>
                          )}
                        </div>
                        <Button size="sm">Adicionar</Button>
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
              <Button>Limpar Filtros</Button>
            </div>
          )}
          
          {/* Pagination */}
          <Pagination className="mx-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  isActive={page === 1}
                  onClick={(e) => { 
                    e.preventDefault();
                    setPage(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  isActive={page === 2}
                  onClick={(e) => { 
                    e.preventDefault();
                    setPage(2);
                  }}
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault();
                    if (page < 2) setPage(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListPage;
