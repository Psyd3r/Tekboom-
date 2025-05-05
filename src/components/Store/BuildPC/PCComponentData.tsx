
import { Computer, Cpu, HardDrive, Monitor, Keyboard, Mouse, Battery, Box } from "lucide-react";
import { ComponentType } from "@/types/buildpc";

// Icons for each component type
export const componentIcons = {
  cpu: <Cpu className="h-5 w-5" />,
  motherboard: <HardDrive className="h-5 w-5" />,
  gpu: <HardDrive className="h-5 w-5" />,
  ram: <HardDrive className="h-5 w-5" />,
  storage: <HardDrive className="h-5 w-5" />,
  psu: <Battery className="h-5 w-5" />,
  case: <Box className="h-5 w-5" />,
  monitor: <Monitor className="h-5 w-5" />,
  keyboard: <Keyboard className="h-5 w-5" />,
  mouse: <Mouse className="h-5 w-5" />,
};

// Names in Portuguese for each type
export const componentNames = {
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

// Map component types to product categories (as stored in the database)
export const typeToCategory = {
  cpu: "cpu",
  motherboard: "motherboard",
  gpu: "gpu",
  ram: "ram",
  storage: "storage",
  psu: "psu",
  case: "case",
  monitor: "monitor",
  keyboard: "keyboard",
  mouse: "mouse"
};
