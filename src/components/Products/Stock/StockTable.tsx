
import { Loader2, Package, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  image: string | null;
}

interface StockTableProps {
  isLoading: boolean;
  products: Product[];
  handleOpenDialog: (product: Product, type: "set" | "add" | "remove") => void;
}

export function StockTable({ isLoading, products, handleOpenDialog }: StockTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStockStatus = (stock: number) => {
    if (stock <= 0) {
      return {
        label: "Sem estoque",
        className: "text-red-600"
      };
    }
    
    if (stock <= 10) {
      return {
        label: "Estoque baixo",
        className: "text-amber-600"
      };
    }
    
    return {
      label: "Em estoque",
      className: "text-green-600"
    };
  };

  return (
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Produto</TableHead>
            <TableHead className="hidden sm:table-cell">SKU</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-center">Estoque</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center justify-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center mr-3">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{product.stock}</span>
                      <span className={`text-xs ${stockStatus.className}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(product, "set")}>
                          Definir estoque
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(product, "add")}>
                          Adicionar unidades
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleOpenDialog(product, "remove")}
                          className="text-red-600"
                          disabled={product.stock <= 0}
                        >
                          Remover unidades
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
