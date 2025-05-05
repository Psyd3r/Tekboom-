
import { useState } from "react";
import { HeroSection } from "@/components/Store/HeroSection";
import { ProductCard } from "@/components/Store/ProductCard";
import { CategoryCard } from "@/components/Store/CategoryCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Mock data for demonstration
const featuredProducts = [
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
  }
];

const categories = [
  {
    id: "1",
    name: "Eletrônicos",
    imageUrl: "https://placehold.co/300x300",
    productCount: 120
  },
  {
    id: "2",
    name: "Informática",
    imageUrl: "https://placehold.co/300x300",
    productCount: 85
  },
  {
    id: "3",
    name: "Acessórios",
    imageUrl: "https://placehold.co/300x300",
    productCount: 240
  },
  {
    id: "4",
    name: "Casa",
    imageUrl: "https://placehold.co/300x300",
    productCount: 170
  }
];

const newArrivals = [
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
    isNew: true,
    isSale: false,
    category: "Áudio"
  },
  {
    id: "7",
    name: "Tablet Pro 11\"",
    price: 1899.99,
    image: "https://placehold.co/300x400",
    rating: 4.6,
    isNew: true,
    isSale: false,
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
  }
];

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-12"
    >
      {/* Hero Section */}
      <HeroSection 
        title="Tecnologia para seu dia a dia"
        subtitle="Encontre os melhores produtos para você com os menores preços"
        ctaText="Ver ofertas"
        ctaLink="/store/produtos"
        imageUrl="https://placehold.co/1200x600"
      />
      
      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categorias</h2>
          <Link to="/store/categorias" className="text-primary flex items-center hover:underline">
            Ver todas
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              imageUrl={category.imageUrl}
              productCount={category.productCount}
            />
          ))}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Produtos em Destaque</h2>
          <Link to="/store/produtos" className="text-primary flex items-center hover:underline">
            Ver todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
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
          ))}
        </div>
      </section>
      
      {/* Banner */}
      <section className="relative overflow-hidden rounded-lg py-12 px-6 bg-gradient-to-r from-[#64B5F6] to-[#1E88E5] text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Oferta Especial</h2>
            <p className="text-lg opacity-90 mb-4">Aproveite 15% de desconto em toda a loja!</p>
            <Button className="bg-white text-primary hover:bg-gray-100">
              <Link to="/store/ofertas">Ver Ofertas</Link>
            </Button>
          </div>
          <div className="text-6xl md:text-8xl font-bold">15% OFF</div>
        </div>
      </section>
      
      {/* New Arrivals Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Novos Produtos</h2>
          <Link to="/store/produtos?filter=novos" className="text-primary flex items-center hover:underline">
            Ver todos
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              rating={product.rating}
              isNew={product.isNew}
              isSale={product.isSale}
              category={product.category}
            />
          ))}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-white p-6 md:p-12 rounded-lg border border-gray-100">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Receba nossas novidades!</h2>
          <p className="text-gray-600 mb-6">
            Cadastre-se para receber ofertas exclusivas e novidades em primeira mão.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-md border border-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button>Inscrever-se</Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
