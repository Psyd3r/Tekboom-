
import React from 'react';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface EmptyCategoryStateProps {
  categoryName: string;
}

export const EmptyCategoryState = ({ categoryName }: EmptyCategoryStateProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="h-10 w-10 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Categoria vazia</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        Não há produtos disponíveis na categoria <strong>{categoryName}</strong> no momento.
        Confira outras categorias ou volte para a página inicial.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/store/produtos">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Ver todos os produtos
          </Link>
        </Button>
        <Button asChild>
          <Link to="/store">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para a loja
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};
