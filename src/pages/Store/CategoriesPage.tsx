
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/Store/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const CategoriesPage = () => {
  const { categories, loading } = useCategories();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/store" className="hover:text-primary">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Categorias</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <h1 className="text-2xl md:text-3xl font-bold">Todas as Categorias</h1>
      
      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Skeleton 
              key={item}
              className="rounded-lg overflow-hidden aspect-square"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              imageUrl={category.imageUrl || "https://placehold.co/300x300"}
              productCount={category.productCount}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg mt-6">
          <p className="text-gray-500">Nenhuma categoria disponível.</p>
        </div>
      )}
    </motion.div>
  );
};

export default CategoriesPage;
