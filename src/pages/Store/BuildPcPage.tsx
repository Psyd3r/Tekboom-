import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Computer, Cpu, HardDrive, Monitor, Keyboard, Mouse, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

// Tipos para os componentes
type ComponentType = 'cpu' | 'motherboard' | 'gpu' | 'ram' | 'storage' | 'psu' | 'case' | 'monitor' | 'keyboard' | 'mouse';

interface PCComponent {
  id: string;
  name: string;
  price: number;
  image: string;
  type: ComponentType;
  specs: string;
  compatibility?: string[];
}

interface SelectedComponents {
  cpu: PCComponent | null;
  motherboard: PCComponent | null;
  gpu: PCComponent | null;
  ram: PCComponent | null;
  storage: PCComponent | null;
  psu: PCComponent | null;
  case: PCComponent | null;
  monitor: PCComponent | null;
  keyboard: PCComponent | null;
  mouse: PCComponent | null;
}

// Componentes simulados para cada categoria
const mockComponents: PCComponent[] = [
  // CPUs
  {
    id: "cpu1",
    name: "Intel Core i9-13900K",
    price: 2999.99,
    image: "https://placehold.co/300x200",
    type: "cpu",
    specs: "24 núcleos, 5.8GHz, Cache 36MB",
    compatibility: ["intel_socket"]
  },
  {
    id: "cpu2",
    name: "AMD Ryzen 9 7950X",
    price: 3299.99,
    image: "https://placehold.co/300x200",
    type: "cpu",
    specs: "16 núcleos, 5.7GHz, Cache 64MB",
    compatibility: ["amd_socket"]
  },
  {
    id: "cpu3",
    name: "Intel Core i7-13700K",
    price: 2199.99,
    image: "https://placehold.co/300x200",
    type: "cpu",
    specs: "16 núcleos, 5.4GHz, Cache 30MB",
    compatibility: ["intel_socket"]
  },
  
  // Placas-mãe
  {
    id: "mb1",
    name: "ASUS ROG Maximus Z790 Hero",
    price: 3499.99,
    image: "https://placehold.co/300x200",
    type: "motherboard",
    specs: "Intel Z790, DDR5, PCIe 5.0, WiFi 6E",
    compatibility: ["intel_socket"]
  },
  {
    id: "mb2",
    name: "MSI MPG X670E Carbon WiFi",
    price: 2899.99,
    image: "https://placehold.co/300x200",
    type: "motherboard",
    specs: "AMD X670E, DDR5, PCIe 5.0, WiFi 6E",
    compatibility: ["amd_socket"]
  },
  {
    id: "mb3",
    name: "Gigabyte Z790 AORUS Elite AX",
    price: 1899.99,
    image: "https://placehold.co/300x200",
    type: "motherboard",
    specs: "Intel Z790, DDR5, PCIe 5.0, WiFi 6E",
    compatibility: ["intel_socket"]
  },
  
  // GPUs
  {
    id: "gpu1",
    name: "NVIDIA GeForce RTX 4090",
    price: 9999.99,
    image: "https://placehold.co/300x200",
    type: "gpu",
    specs: "24GB GDDR6X, 16384 CUDA Cores"
  },
  {
    id: "gpu2",
    name: "AMD Radeon RX 7900 XTX",
    price: 7499.99,
    image: "https://placehold.co/300x200",
    type: "gpu",
    specs: "24GB GDDR6, 12288 Stream Processors"
  },
  {
    id: "gpu3",
    name: "NVIDIA GeForce RTX 4080",
    price: 6999.99,
    image: "https://placehold.co/300x200",
    type: "gpu",
    specs: "16GB GDDR6X, 9728 CUDA Cores"
  },
  
  // Memória RAM
  {
    id: "ram1",
    name: "Corsair Dominator Platinum RGB 32GB",
    price: 1199.99,
    image: "https://placehold.co/300x200",
    type: "ram",
    specs: "2x16GB, DDR5, 6000MHz, CL36"
  },
  {
    id: "ram2",
    name: "G.SKILL Trident Z5 RGB 32GB",
    price: 1099.99,
    image: "https://placehold.co/300x200",
    type: "ram",
    specs: "2x16GB, DDR5, 5600MHz, CL36"
  },
  {
    id: "ram3",
    name: "Kingston FURY Beast 32GB",
    price: 899.99,
    image: "https://placehold.co/300x200",
    type: "ram",
    specs: "2x16GB, DDR5, 5200MHz, CL40"
  },
  
  // Armazenamento
  {
    id: "storage1",
    name: "Samsung 990 PRO 2TB",
    price: 1499.99,
    image: "https://placehold.co/300x200",
    type: "storage",
    specs: "SSD NVMe, PCIe 4.0, 7450MB/s"
  },
  {
    id: "storage2",
    name: "WD Black SN850X 1TB",
    price: 899.99,
    image: "https://placehold.co/300x200",
    type: "storage",
    specs: "SSD NVMe, PCIe 4.0, 7300MB/s"
  },
  {
    id: "storage3",
    name: "Crucial T700 2TB",
    price: 1299.99,
    image: "https://placehold.co/300x200",
    type: "storage",
    specs: "SSD NVMe, PCIe 5.0, 12400MB/s"
  },
  
  // Fontes
  {
    id: "psu1",
    name: "Corsair HX1500i",
    price: 2199.99,
    image: "https://placehold.co/300x200",
    type: "psu",
    specs: "1500W, Platinum, Modular"
  },
  {
    id: "psu2",
    name: "EVGA SuperNOVA 1000 G6",
    price: 1299.99,
    image: "https://placehold.co/300x200",
    type: "psu",
    specs: "1000W, Gold, Modular"
  },
  {
    id: "psu3",
    name: "be quiet! Dark Power 12 1000W",
    price: 1699.99,
    image: "https://placehold.co/300x200",
    type: "psu",
    specs: "1000W, Titanium, Modular"
  },
  
  // Gabinetes
  {
    id: "case1",
    name: "Lian Li O11 Dynamic EVO",
    price: 999.99,
    image: "https://placehold.co/300x200",
    type: "case",
    specs: "Mid-Tower, Vidro temperado, RGB"
  },
  {
    id: "case2",
    name: "Corsair 5000D Airflow",
    price: 899.99,
    image: "https://placehold.co/300x200",
    type: "case",
    specs: "Mid-Tower, Alto fluxo de ar"
  },
  {
    id: "case3",
    name: "Fractal Design Meshify 2",
    price: 799.99,
    image: "https://placehold.co/300x200",
    type: "case",
    specs: "Mid-Tower, Malha frontal"
  },
  
  // Monitores
  {
    id: "monitor1",
    name: "LG UltraGear 27GP950",
    price: 3999.99,
    image: "https://placehold.co/300x200",
    type: "monitor",
    specs: "27\", 4K, 144Hz, 1ms, HDR600"
  },
  {
    id: "monitor2",
    name: "Samsung Odyssey G7",
    price: 2999.99,
    image: "https://placehold.co/300x200",
    type: "monitor",
    specs: "32\", 1440p, 240Hz, 1ms, HDR600"
  },
  {
    id: "monitor3",
    name: "ASUS ROG Swift PG279QM",
    price: 3499.99,
    image: "https://placehold.co/300x200",
    type: "monitor",
    specs: "27\", 1440p, 240Hz, 1ms, G-SYNC"
  },
  
  // Teclados
  {
    id: "keyboard1",
    name: "Logitech G915 TKL",
    price: 999.99,
    image: "https://placehold.co/300x200",
    type: "keyboard",
    specs: "Sem fio, Mecânico, RGB"
  },
  {
    id: "keyboard2",
    name: "Razer BlackWidow V3 Pro",
    price: 1099.99,
    image: "https://placehold.co/300x200",
    type: "keyboard",
    specs: "Sem fio, Mecânico, RGB"
  },
  {
    id: "keyboard3",
    name: "SteelSeries Apex Pro",
    price: 1199.99,
    image: "https://placehold.co/300x200",
    type: "keyboard",
    specs: "Teclas ajustáveis, OLED, RGB"
  },
  
  // Mouses
  {
    id: "mouse1",
    name: "Logitech G Pro X Superlight",
    price: 699.99,
    image: "https://placehold.co/300x200",
    type: "mouse",
    specs: "Sem fio, 25.000 DPI, 63g"
  },
  {
    id: "mouse2",
    name: "Razer DeathAdder V3 Pro",
    price: 749.99,
    image: "https://placehold.co/300x200",
    type: "mouse",
    specs: "Sem fio, 30.000 DPI, 64g"
  },
  {
    id: "mouse3",
    name: "SteelSeries Prime Wireless",
    price: 599.99,
    image: "https://placehold.co/300x200",
    type: "mouse",
    specs: "Sem fio, 18.000 DPI, 80g"
  },
];

// Ícones para cada componente
const componentIcons = {
  cpu: <Cpu className="h-5 w-5" />,
  motherboard: <HardDrive className="h-5 w-5" />,
  gpu: <HardDrive className="h-5 w-5" />,
  ram: <HardDrive className="h-5 w-5" />, // Substituído Memory por HardDrive
  storage: <HardDrive className="h-5 w-5" />,
  psu: <HardDrive className="h-5 w-5" />,
  case: <Computer className="h-5 w-5" />,
  monitor: <Monitor className="h-5 w-5" />,
  keyboard: <Keyboard className="h-5 w-5" />,
  mouse: <Mouse className="h-5 w-5" />,
};

// Nomes em português para cada tipo
const componentNames = {
  cpu: "Processador",
  motherboard: "Placa-mãe",
  gpu: "Placa de Vídeo",
  ram: "Memória RAM",
  storage: "Armazenamento",
  psu: "Fonte",
  case: "Gabinete",
  monitor: "Monitor",
  keyboard: "Teclado",
  mouse: "Mouse",
};

const BuildPcPage = () => {
  const [selectedTab, setSelectedTab] = useState<ComponentType>("cpu");
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
    case: null,
    monitor: null,
    keyboard: null,
    mouse: null,
  });
  
  const { addToCart } = useCart();
  
  // Filtrar componentes pelo tipo selecionado
  const filteredComponents = mockComponents.filter(component => component.type === selectedTab);
  
  // Calcular o preço total
  const totalPrice = Object.values(selectedComponents).reduce((sum, component) => {
    return sum + (component ? component.price : 0);
  }, 0);
  
  // Verificar se todos os componentes essenciais foram selecionados
  const hasEssentialComponents = selectedComponents.cpu && 
                               selectedComponents.motherboard && 
                               selectedComponents.ram && 
                               selectedComponents.storage && 
                               selectedComponents.psu && 
                               selectedComponents.case;
  
  // Função para selecionar um componente
  const selectComponent = (component: PCComponent) => {
    setSelectedComponents({
      ...selectedComponents,
      [component.type]: component
    });
  };
  
  // Função para remover um componente selecionado
  const removeComponent = (type: ComponentType) => {
    setSelectedComponents({
      ...selectedComponents,
      [type]: null
    });
  };
  
  // Função para adicionar todos os componentes ao carrinho
  const addAllToCart = () => {
    Object.values(selectedComponents).forEach(component => {
      if (component) {
        addToCart({
          id: crypto.randomUUID(),
          product_id: component.id,
          name: component.name,
          price: component.price,
          quantity: 1,
          image: component.image,
          total: component.price
        });
      }
    });
    
    toast.success("Montagem adicionada ao carrinho!");
  };
  
  // Função para verificar compatibilidade entre CPU e placa-mãe
  const checkCompatibility = () => {
    const { cpu, motherboard } = selectedComponents;
    
    if (!cpu || !motherboard) return true;
    
    // Verificar se a CPU é compatível com a placa-mãe
    const cpuCompatibility = cpu.compatibility || [];
    const motherboardCompatibility = motherboard.compatibility || [];
    
    // Se houver pelo menos uma compatibilidade em comum, os componentes são compatíveis
    return cpuCompatibility.some(c => motherboardCompatibility.includes(c));
  };
  
  // Verificar compatibilidade
  const isCompatible = checkCompatibility();

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Componentes selecionados */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Sua Configuração</CardTitle>
              <CardDescription>Componentes selecionados para seu PC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(componentNames).map(([key, name]) => {
                const type = key as ComponentType;
                const component = selectedComponents[type];
                
                return (
                  <div 
                    key={key} 
                    className={`p-3 rounded-lg border ${
                      component 
                        ? 'border-primary bg-primary/5' 
                        : 'border-dashed border-gray-300'
                    }`}
                    onClick={() => setSelectedTab(type)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {componentIcons[type]}
                        <div>
                          <p className="font-medium">{name}</p>
                          {component ? (
                            <>
                              <p className="text-sm text-gray-600 line-clamp-1">{component.name}</p>
                              <p className="text-sm font-medium">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(component.price)}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Nenhum selecionado</p>
                          )}
                        </div>
                      </div>
                      
                      {component && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeComponent(type);
                          }}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {!isCompatible && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg">
                  <p className="text-sm font-medium">⚠️ Incompatibilidade detectada entre CPU e placa-mãe</p>
                </div>
              )}
              
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <div className="w-full flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(totalPrice)}
                </span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={addAllToCart}
                disabled={!hasEssentialComponents || !isCompatible}
              >
                Adicionar ao Carrinho
              </Button>
              {!hasEssentialComponents && (
                <p className="text-sm text-gray-500 text-center">
                  Selecione todos os componentes essenciais para continuar
                </p>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Seleção de componentes */}
        <div className="w-full lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Selecione seus Componentes</CardTitle>
              <CardDescription>Escolha as peças para montar seu computador</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as ComponentType)}>
                <ScrollArea className="w-full">
                  <TabsList className="mb-4 w-full justify-start">
                    {Object.entries(componentNames).map(([key, name]) => (
                      <TabsTrigger key={key} value={key} className="min-w-24">
                        <div className="flex items-center gap-2">
                          {componentIcons[key as ComponentType]}
                          <span>{name}</span>
                          {selectedComponents[key as ComponentType] && (
                            <Check className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
                
                {Object.keys(componentNames).map((key) => (
                  <TabsContent key={key} value={key} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredComponents.map((component) => (
                        <Card key={component.id} className="overflow-hidden">
                          <div className="aspect-square bg-gray-100 relative">
                            <img 
                              src={component.image} 
                              alt={component.name} 
                              className="object-contain w-full h-full p-4"
                            />
                          </div>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base">{component.name}</CardTitle>
                            <CardDescription>{component.specs}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between pt-0">
                            <span className="font-bold">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(component.price)}
                            </span>
                            <Button 
                              onClick={() => selectComponent(component)}
                              variant={selectedComponents[component.type]?.id === component.id ? "secondary" : "default"}
                            >
                              {selectedComponents[component.type]?.id === component.id ? 
                                "Selecionado" : "Selecionar"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuildPcPage;
