
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductFormHeaderProps {
  editMode: boolean;
}

export function ProductFormHeader({ editMode }: ProductFormHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/produtos")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {editMode ? "Editar Produto" : "Novo Produto"}
        </h1>
      </div>
    </div>
  );
}
