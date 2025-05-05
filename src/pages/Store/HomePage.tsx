
import { motion } from "framer-motion";
import { HeroSection } from "@/components/Store/HeroSection";
import { CategoriesSection } from "@/components/Store/CategoriesSection";
import { ProductsSection } from "@/components/Store/ProductsSection";
import { PromoBanner } from "@/components/Store/PromoBanner";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

const HomePage = () => {
  // Use our custom hooks to fetch data
  const { categories, loading: loadingCategories } = useCategories();
  const { products: featuredProducts, loading: loadingFeatured } = useProducts('featured', 4);
  const { products: newArrivals, loading: loadingNewArrivals } = useProducts('new', 4);

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
        ctaLink="/store/ofertas"
        imageUrl="https://placehold.co/1200x600"
      />
      
      {/* Categories Section */}
      <CategoriesSection 
        categories={categories} 
        loading={loadingCategories} 
      />
      
      {/* Featured Products Section */}
      <ProductsSection 
        title="Produtos em Destaque"
        linkText="Ver todos"
        linkUrl="/store/produtos"
        products={featuredProducts}
        loading={loadingFeatured}
        emptyTitle="Produto em Destaque"
      />
      
      {/* Banner */}
      <PromoBanner 
        title="Oferta Especial"
        subtitle="Aproveite 15% de desconto em toda a loja!"
        buttonText="Ver Ofertas"
        buttonLink="/store/ofertas"
        highlightText="15% OFF"
      />
      
      {/* New Arrivals Section */}
      <ProductsSection 
        title="Novos Produtos"
        linkText="Ver todos"
        linkUrl="/store/produtos?filter=novos"
        products={newArrivals}
        loading={loadingNewArrivals}
        emptyTitle="Novo Produto"
      />
    </motion.div>
  );
};

export default HomePage;
