
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_url: string;
  order_index: number;
  active: boolean;
}

export const BannerManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [formValues, setFormValues] = useState<Omit<Banner, 'id'>>({
    title: "",
    subtitle: "",
    button_text: "Ver mais",
    button_link: "/store/produtos",
    image_url: "",
    order_index: 0,
    active: true
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order_index');
      
      if (error) {
        console.error('Error fetching banners:', error);
        throw error;
      }
      
      return data as Banner[];
    }
  });

  const createBannerMutation = useMutation({
    mutationFn: async (banner: Omit<Banner, 'id'>) => {
      // Upload image first if there is a selected file
      let image_url = banner.image_url;
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `banners/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('marketing')
          .upload(filePath, selectedFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage.from('marketing').getPublicUrl(filePath);
        image_url = data.publicUrl;
      }
      
      // Insert banner with image URL
      const { data, error } = await supabase
        .from('banners')
        .insert([{ ...banner, image_url }])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      resetForm();
      toast({
        title: "Banner criado",
        description: "O banner foi criado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating banner:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o banner.",
        variant: "destructive",
      });
    }
  });

  const updateBannerMutation = useMutation({
    mutationFn: async (banner: Banner) => {
      let image_url = banner.image_url;
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `banners/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('marketing')
          .upload(filePath, selectedFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage.from('marketing').getPublicUrl(filePath);
        image_url = data.publicUrl;
      }
      
      const { data, error } = await supabase
        .from('banners')
        .update({ ...banner, image_url })
        .eq('id', banner.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      resetForm();
      toast({
        title: "Banner atualizado",
        description: "O banner foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating banner:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o banner.",
        variant: "destructive",
      });
    }
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Banner removido",
        description: "O banner foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error deleting banner:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o banner.",
        variant: "destructive",
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      updateBannerMutation.mutate({
        ...formValues,
        id: editing.id
      } as Banner);
    } else {
      createBannerMutation.mutate(formValues);
    }
  };

  const resetForm = () => {
    setFormValues({
      title: "",
      subtitle: "",
      button_text: "Ver mais",
      button_link: "/store/produtos",
      image_url: "",
      order_index: banners.length,
      active: true
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditing(null);
  };

  const startEditing = (banner: Banner) => {
    setEditing(banner);
    setFormValues({
      title: banner.title,
      subtitle: banner.subtitle,
      button_text: banner.button_text,
      button_link: banner.button_link,
      image_url: banner.image_url,
      order_index: banner.order_index,
      active: banner.active
    });
    setPreviewUrl(banner.image_url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editing ? "Editar Banner" : "Adicionar Novo Banner"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                  placeholder="Título do banner"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={formValues.subtitle || ""}
                  onChange={handleInputChange}
                  placeholder="Subtítulo do banner"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button_text">Texto do Botão</Label>
                <Input
                  id="button_text"
                  name="button_text"
                  value={formValues.button_text}
                  onChange={handleInputChange}
                  placeholder="Ex: Ver mais"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="button_link">Link do Botão</Label>
                <Input
                  id="button_link"
                  name="button_link"
                  value={formValues.button_link}
                  onChange={handleInputChange}
                  placeholder="Ex: /store/produtos"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Ordem</Label>
                <Input
                  id="order_index"
                  name="order_index"
                  type="number"
                  value={formValues.order_index}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 flex items-center pt-8">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={formValues.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="active" className="ml-2">Banner Ativo</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Imagem do Banner</Label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  {previewUrl ? (
                    <div className="relative w-full">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto max-h-[200px] object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Arraste uma imagem ou clique para selecionar
                      </p>
                    </div>
                  )}
                  
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={previewUrl ? "hidden" : ""}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading || createBannerMutation.isPending || updateBannerMutation.isPending}>
                {editing ? "Atualizar Banner" : "Adicionar Banner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Banners Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center">Carregando...</div>
          ) : banners.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhum banner cadastrado</p>
              <p className="text-sm">Adicione um banner usando o formulário acima</p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className={`flex items-center justify-between p-4 border rounded-md ${
                    banner.active ? "" : "opacity-60 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      {banner.image_url ? (
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{banner.title}</h4>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {banner.subtitle}
                      </p>
                      <div className="text-xs text-gray-400 mt-1">
                        Ordem: {banner.order_index} | Status: {banner.active ? "Ativo" : "Inativo"}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBannerMutation.mutate(banner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
