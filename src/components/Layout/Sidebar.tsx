import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, ShoppingCart, Users, Settings, PackageOpen, Package } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  const sidebarLinks = [
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

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Teekbom Admin
          </h2>
          <div className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.href}
                  variant={link.active(location.pathname) ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={link.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
