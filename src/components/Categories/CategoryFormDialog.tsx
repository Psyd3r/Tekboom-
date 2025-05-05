
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/hooks/useCategoriesAdmin";
import { Upload } from "lucide-react";

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  selectedCategory: Category | null;
  formData: {
    name: string;
    image: File | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    image: File | null;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
}

export const CategoryFormDialog = ({
  isOpen,
  onClose,
  isLoading,
  selectedCategory,
  formData,
  setFormData,
  onSubmit,
}: CategoryFormDialogProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedCategory ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome da Categoria</Label>
            <Input
              id="category-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome da categoria"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category-image">Imagem da Categoria</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={isLoading}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {formData.image ? formData.image.name : "Selecionar imagem"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                id="category-image"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
            
            {selectedCategory && selectedCategory.image_url && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">Imagem atual:</p>
                <div className="h-20 w-20 overflow-hidden rounded-md border">
                  <img
                    src={selectedCategory.image_url}
                    alt={selectedCategory.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : selectedCategory ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
