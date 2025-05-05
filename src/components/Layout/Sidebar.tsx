
import { cn } from "@/lib/utils";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Store,
  UserCog
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed: boolean;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: SidebarItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className={cn(
              "flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-300",
              active 
                ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className="h-5 w-5 min-w-5" />
            {!collapsed && (
              <span className="ml-3 whitespace-nowrap">{label}</span>
            )}
          </Link>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="bg-secondary text-white">
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, user } = useAuth();

  const mainNavItems = [
    { icon: Package, label: "Produtos", href: "/produtos" },
    { icon: ShoppingBag, label: "Pedidos", href: "/pedidos" },
    { icon: Users, label: "Clientes", href: "/clientes" },
    { icon: UserCog, label: "Usuários", href: "/usuarios" },
    { icon: Settings, label: "Configurações", href: "/configuracoes" },
  ];

  return (
    <aside 
      className={cn(
        "bg-sidebar fixed top-0 left-0 h-full flex flex-col z-40 transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Store className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl text-sidebar-foreground">Teekbom</span>
          </div>
        )}
        {collapsed && (
          <Store className="h-7 w-7 text-primary" />
        )}
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        {mainNavItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={currentPath === item.href || 
              (item.href !== "/" && currentPath.startsWith(item.href))}
            collapsed={collapsed}
          />
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between text-sidebar-foreground">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs opacity-70">{user?.email || "admin@teekbom.com"}</span>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sair
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
