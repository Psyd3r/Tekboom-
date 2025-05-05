
import { NewOrderForm } from "@/components/Orders/NewOrderForm";
import { motion } from "framer-motion";

const NewOrder = () => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Criar Novo Pedido</h1>
        <p className="text-gray-500 mt-1">Preencha os dados para criar um novo pedido manualmente</p>
      </div>
      
      <NewOrderForm />
    </motion.div>
  );
};

export default NewOrder;
