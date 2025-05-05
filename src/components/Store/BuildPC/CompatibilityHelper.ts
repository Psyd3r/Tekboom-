
import { PCComponent, SelectedComponents } from "@/types/buildpc";

// Função para verificar compatibilidade entre CPU e placa-mãe
export const checkCompatibility = (selectedComponents: SelectedComponents): boolean => {
  const { cpu, motherboard } = selectedComponents;
  
  if (!cpu || !motherboard) return true;
  
  // Verificar se a CPU é compatível com a placa-mãe
  const cpuCompatibility = cpu.compatibility || [];
  const motherboardCompatibility = motherboard.compatibility || [];
  
  // Se houver pelo menos uma compatibilidade em comum, os componentes são compatíveis
  return cpuCompatibility.some(c => motherboardCompatibility.includes(c));
};

// Verificar se todos os componentes essenciais foram selecionados
export const hasEssentialComponents = (selectedComponents: SelectedComponents): boolean => {
  return !!(
    selectedComponents.cpu && 
    selectedComponents.motherboard && 
    selectedComponents.ram && 
    selectedComponents.storage && 
    selectedComponents.psu && 
    selectedComponents.case
  );
};

// Calcular o preço total dos componentes selecionados
export const calculateTotalPrice = (selectedComponents: SelectedComponents): number => {
  return Object.values(selectedComponents).reduce((sum, component) => {
    return sum + (component ? component.price : 0);
  }, 0);
};
