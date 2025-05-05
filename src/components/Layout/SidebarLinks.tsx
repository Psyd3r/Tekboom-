
import { Home, ShoppingCart, Users, Settings, PackageOpen, Package } from "lucide-react";

export const sidebarLinks = [
  {
    label: "Produtos",
    href: "/produtos",
    icon: Package,
    active: (path: string) => path === "/produtos" || path.startsWith("/produtos/"),
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
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    active: (path: string) => path === "/configuracoes",
  },
];
