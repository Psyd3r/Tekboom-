
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

import { ComponentSelector } from "@/components/Store/BuildPC/ComponentSelector";
import { SelectedComponentsList } from "@/components/Store/BuildPC/SelectedComponentsList";
import { mockComponents } from "@/components/Store/BuildPC/PCComponentData";
import { BuildPCSummary } from "@/components/Store/BuildPC/BuildPCSummary";
import { 
  checkCompatibility, 
  hasEssentialComponents, 
  calculateTotalPrice 
} from "@/components/Store/BuildPC/CompatibilityHelper";
import { ComponentType, PCComponent, SelectedComponents } from "@/types/buildpc";

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
  const totalPrice = calculateTotalPrice(selectedComponents);
  
  // Verificar se todos os componentes essenciais foram selecionados
  const essentialComponentsSelected = hasEssentialComponents(selectedComponents);
  
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
  
  // Verificar compatibilidade
  const isCompatible = checkCompatibility(selectedComponents);

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
              <SelectedComponentsList 
                selectedComponents={selectedComponents}
                removeComponent={removeComponent}
                setSelectedTab={setSelectedTab}
                isCompatible={isCompatible}
              />
            </CardContent>
            <BuildPCSummary 
              totalPrice={totalPrice}
              hasEssentialComponents={essentialComponentsSelected}
              isCompatible={isCompatible}
              onAddToCart={addAllToCart}
            />
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
                <ComponentSelector 
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  selectedComponents={selectedComponents}
                  filteredComponents={filteredComponents}
                  selectComponent={selectComponent}
                />
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuildPcPage;
