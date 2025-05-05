
import { ShoppingBag } from "lucide-react";

export const CustomerAccessNotice = () => {
  return (
    <div className="p-3 bg-blue-50 rounded-md text-blue-700 mb-4 flex items-center gap-2">
      <ShoppingBag className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">Área do Cliente - Acesse para comprar</p>
    </div>
  );
};
