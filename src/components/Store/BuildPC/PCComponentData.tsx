
import { Computer, Cpu, HardDrive, Monitor, Keyboard, Mouse } from "lucide-react";
import { ComponentType, PCComponent } from "@/types/buildpc";

// Ícones para cada componente
export const componentIcons = {
  cpu: <Cpu className="h-5 w-5" />,
  motherboard: <HardDrive className="h-5 w-5" />,
  gpu: <HardDrive className="h-5 w-5" />,
  ram: <HardDrive className="h-5 w-5" />,
  storage: <HardDrive className="h-5 w-5" />,
  psu: <HardDrive className="h-5 w-5" />,
  case: <Computer className="h-5 w-5" />,
  monitor: <Monitor className="h-5 w-5" />,
  keyboard: <Keyboard className="h-5 w-5" />,
  mouse: <Mouse className="h-5 w-5" />,
};

// Nomes em português para cada tipo
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

// Componentes simulados para cada categoria
export const mockComponents: PCComponent[] = [
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
