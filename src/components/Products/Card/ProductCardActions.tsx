
import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardActionsProps {
  id: string;
  isDeleting: boolean;
  onDeleteClick: () => void;
}

export const ProductCardActions = ({ 
  id, 
  isDeleting, 
  onDeleteClick 
}: ProductCardActionsProps) => {
  return (
    <div className="flex border-t border-gray-100">
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 rounded-none border-r h-10"
        asChild
      >
        <Link to={`/produtos/${id}/editar`}>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 rounded-none h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={onDeleteClick}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4 mr-2" />
        )}
        Excluir
      </Button>
    </div>
  );
};
