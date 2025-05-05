
import { Check } from "lucide-react";
import { ComponentType, PCComponent, SelectedComponents } from "@/types/buildpc";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PCComponentCard } from "./PCComponentCard";
import { componentIcons, componentNames } from "./PCComponentData";
import { Skeleton } from "@/components/ui/skeleton";

interface ComponentSelectorProps {
  selectedTab: ComponentType;
  setSelectedTab: (tab: ComponentType) => void;
  selectedComponents: SelectedComponents;
  components: PCComponent[];
  isLoading: boolean;
  selectComponent: (component: PCComponent) => void;
}

export const ComponentSelector = ({ 
  selectedTab, 
  setSelectedTab, 
  selectedComponents, 
  components, 
  isLoading,
  selectComponent 
}: ComponentSelectorProps) => {
  return (
    <>
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Skeleton key={item} className="h-80 w-full rounded-lg" />
              ))}
            </div>
          ) : components.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((component) => (
                <PCComponentCard
                  key={component.id}
                  component={component}
                  isSelected={selectedComponents[component.type]?.id === component.id}
                  onSelect={selectComponent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500">Nenhum componente encontrado para esta categoria.</p>
            </div>
          )}
        </TabsContent>
      ))}
    </>
  );
};
