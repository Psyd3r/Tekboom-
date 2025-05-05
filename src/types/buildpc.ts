
// Tipos para os componentes
export type ComponentType = 'cpu' | 'motherboard' | 'gpu' | 'ram' | 'storage' | 'psu' | 'case' | 'monitor' | 'keyboard' | 'mouse';

export interface PCComponent {
  id: string;
  name: string;
  price: number;
  image: string;
  type: ComponentType;
  specs: string;
  compatibility?: string[];
}

export interface SelectedComponents {
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
