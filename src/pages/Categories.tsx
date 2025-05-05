
import React, { useState } from "react";
import { AdminHeaderExtras } from "@/components/Layout/AdminHeaderExtras";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { CategoryFormDialog } from "@/components/Categories/CategoryFormDialog";
import { DeleteCategoryDialog } from "@/components/Categories/DeleteCategoryDialog";
import { useCategoriesAdmin, Category } from "@/hooks/useCategoriesAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/formatters";

const Categories = () => {
  const {
    categories,
    isLoading,
    selectedCategory,
    isDialogOpen,
    formData,
    setFormData,
    openNewCategoryDialog,
    editCategory,
    deleteCategory,
    handleSubmit,
    setIsDialogOpen,
  } = useCategoriesAdmin();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleOpenDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <div className="flex items-center space-x-2">
          <AdminHeaderExtras />
          <Button onClick={openNewCategoryDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : categories.length > 0 ? (
        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Imagem</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {category.image_url ? (
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sem imagem</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(category.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editCategory(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(category)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-md shadow">
          <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-gray-500 mb-6">
            Você ainda não criou nenhuma categoria.
            Clique no botão abaixo para criar sua primeira categoria.
          </p>
          <Button onClick={openNewCategoryDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Categoria
          </Button>
        </div>
      )}

      <CategoryFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      {categoryToDelete && (
        <DeleteCategoryDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          isLoading={isLoading}
          categoryName={categoryToDelete.name}
        />
      )}
    </div>
  );
};

export default Categories;
