
import { Home, ShoppingCart, Users, Settings, PackageOpen, Package, UserPlus, Layers, ImageIcon } from "lucide-react";

export const sidebarLinks = [
  {
    label: "Produtos",
    href: "/produtos",
    icon: Package,
    active: (path: string) => path === "/produtos" || path.startsWith("/produtos/"),
  },
  {
    label: "Categorias",
    href: "/categorias",
    icon: Layers,
    active: (path: string) => path === "/categorias",
  },
  {
    label: "Estoque",
    href: "/estoque",
    icon: PackageOpen,
    active: (path: string) => path === "/estoque",
  },
  {
    label: "Pedidos",
    href: "/pedidos",
    icon: ShoppingCart,
    active: (path: string) => path === "/pedidos" || path.startsWith("/pedidos/"),
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users,
    active: (path: string) => path === "/clientes",
  },
  {
    label: "Marketing",
    href: "/marketing",
    icon: ImageIcon,
    active: (path: string) => path === "/marketing",
  },
  {
    label: "Usuários Admin",
    href: "/usuarios",
    icon: UserPlus,
    active: (path: string) => path === "/usuarios",
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    active: (path: string) => path === "/configuracoes",
  },
];
