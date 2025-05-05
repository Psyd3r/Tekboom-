
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductFormActionsProps {
  isSubmitting: boolean;
  editMode: boolean;
}

export function ProductFormActions({ isSubmitting, editMode }: ProductFormActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={() => navigate("/produtos")}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {isSubmitting ? "Salvando..." : "Salvar Produto"}
      </Button>
    </div>
  );
}
