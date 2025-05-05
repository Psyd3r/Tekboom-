
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, RefreshCw, Check, Store, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Json } from "@/integrations/supabase/types"; // Import the Json type from Supabase types
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Logo {
  id: string;
  imageUrl: string;
  altText: string;
}

export const LogoManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState("Teekbom Store");

  const { data: logoConfig, isLoading } = useQuery({
    queryKey: ['logo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'logo')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No logo found, returning null
          return null;
        }
        throw error;
      }
      
      try {
        // We need to explicitly cast to Logo type with appropriate type assertions
        const logoValue = data.value as unknown as Logo;
        return {
          id: data.id,
          key: data.key,
          value: logoValue
        };
      } catch (e) {
        return null;
      }
    }
  });

  const updateLogoMutation = useMutation({
    mutationFn: async ({ imageUrl, altText }: { imageUrl: string; altText: string }) => {
      const logoData: Logo = {
        id: uuidv4(),
        imageUrl,
        altText
      };

      if (logoConfig) {
        // Update existing logo with the correct type casting
        const { data, error } = await supabase
          .from('site_config')
          .update({ value: logoData as unknown as Json })
          .eq('key', 'logo')
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new logo entry
        const { data, error } = await supabase
          .from('site_config')
          .insert({ 
            key: 'logo',
            value: logoData as unknown as Json
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logo'] });
      queryClient.invalidateQueries({ queryKey: ['store-logo'] }); // Also invalidate the store logo query
      setSelectedFile(null);
      toast({
        title: "Logo atualizado",
        description: "O logo foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating logo:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o logo.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (logoConfig && logoConfig.value) {
      setPreviewUrl(logoConfig.value.imageUrl);
      setAltText(logoConfig.value.altText);
    }
  }, [logoConfig]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = logoConfig?.value?.imageUrl || '';
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `logo.${fileExt}`;
        const filePath = `logo/${fileName}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('marketing')
          .upload(filePath, selectedFile, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage.from('marketing').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      } else if (!imageUrl) {
        toast({
          title: "Erro",
          description: "Por favor, selecione uma imagem para o logo.",
          variant: "destructive",
        });
        return;
      }
      
      // Update logo in database
      updateLogoMutation.mutate({ 
        imageUrl, 
        altText 
      });
      
    } catch (error) {
      console.error('Error in logo submission:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o logo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Logo da Loja</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="logo-image">Imagem do Logo</Label>
              
              {/* Logo design guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm">
                <h3 className="font-medium text-blue-700 mb-1">Recomendações para o Logo:</h3>
                <ul className="list-disc pl-5 text-blue-600 space-y-1">
                  <li>Resolução ideal: <strong>400x120 pixels</strong></li>
                  <li>Formato: PNG ou SVG com fundo transparente</li>
                  <li>Tamanho máximo: 2MB</li>
                  <li>Para melhor visualização, mantenha o logo com altura máxima de 40px</li>
                </ul>
              </div>
              
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-4 rounded inline-flex items-center justify-center mb-4">
                      <img
                        src={previewUrl}
                        alt="Logo preview"
                        className="max-h-16"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const fileInput = document.getElementById('logo-image') as HTMLInputElement;
                              if (fileInput) fileInput.click();
                            }}
                            className="flex items-center space-x-1"
                          >
                            <Upload className="h-3 w-3" />
                            <span>Substituir</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          Escolher uma nova imagem para o logo
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (logoConfig?.value) {
                                setPreviewUrl(logoConfig.value.imageUrl);
                                setSelectedFile(null);
                              } else {
                                setPreviewUrl(null);
                                setSelectedFile(null);
                              }
                            }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            <span>Restaurar</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          Reverter para a última versão salva
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">
                      Selecione o logo da sua loja
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        const fileInput = document.getElementById('logo-image') as HTMLInputElement;
                        if (fileInput) fileInput.click();
                      }}
                      className="mt-3"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Escolher imagem
                    </Button>
                  </div>
                )}
                <Input
                  id="logo-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="altText">Texto Alternativo</Label>
              <Input
                id="altText"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descrição do logo para acessibilidade"
              />
              <p className="text-xs text-gray-500">
                Este texto será exibido junto ao logo e usado como descrição da imagem para leitores de tela.
              </p>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit"
                disabled={updateLogoMutation.isPending}
                className="flex items-center space-x-1"
              >
                {updateLogoMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>Salvar Logo</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-md flex justify-center">
              <div className="flex items-center gap-2">
                {previewUrl ? (
                  <img src={previewUrl} alt={altText} className="h-8" />
                ) : (
                  <Store className="h-7 w-7 text-primary" />
                )}
                <span className="font-bold text-xl">{altText || "Teekbom"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
