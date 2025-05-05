
import { Check } from "lucide-react";
import { ComponentType, PCComponent, SelectedComponents } from "@/types/buildpc";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PCComponentCard } from "./PCComponentCard";
import { componentIcons, componentNames } from "./PCComponentData";

interface ComponentSelectorProps {
  selectedTab: ComponentType;
  setSelectedTab: (tab: ComponentType) => void;
  selectedComponents: SelectedComponents;
  filteredComponents: PCComponent[];
  selectComponent: (component: PCComponent) => void;
}

export const ComponentSelector = ({ 
  selectedTab, 
  setSelectedTab, 
  selectedComponents, 
  filteredComponents, 
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComponents.map((component) => (
              <PCComponentCard
                key={component.id}
                component={component}
                isSelected={selectedComponents[component.type]?.id === component.id}
                onSelect={selectComponent}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </>
  );
};
