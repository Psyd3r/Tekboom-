
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  sku: string;
  onDiscountValue?: number;
  className?: string;
  onDelete?: () => void;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  stock,
  sku,
  onDiscountValue,
  className,
  onDelete,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  const discountedPrice = onDiscountValue 
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price - (price * onDiscountValue / 100))
    : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Ocorreu um erro ao excluir o produto.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-card-hover",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-300",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
          {onDiscountValue && (
            <Badge className="absolute top-2 left-2 bg-primary">
              {onDiscountValue}% OFF
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-1">{name}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-bold text-lg">
              {discountedPrice || formattedPrice}
            </span>
            {discountedPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formattedPrice}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              SKU: {sku}
            </span>
            <span className={cn(
              "text-sm font-medium",
              stock > 10 ? "text-green-600" : stock > 0 ? "text-amber-600" : "text-red-600"
            )}>
              {stock > 0 ? `${stock} em estoque` : "Sem estoque"}
            </span>
          </div>
        </div>
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
            onClick={() => setShowDeleteDialog(true)}
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
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
