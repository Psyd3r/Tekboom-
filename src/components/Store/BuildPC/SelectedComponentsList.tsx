
import { Button } from "@/components/ui/button";
import { ComponentType, PCComponent, SelectedComponents } from "@/types/buildpc";
import { componentIcons, componentNames } from "./PCComponentData";

interface SelectedComponentsListProps {
  selectedComponents: SelectedComponents;
  removeComponent: (type: ComponentType) => void;
  setSelectedTab: (tab: ComponentType) => void;
  isCompatible: boolean;
}

export const SelectedComponentsList = ({ 
  selectedComponents, 
  removeComponent, 
  setSelectedTab,
  isCompatible
}: SelectedComponentsListProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
