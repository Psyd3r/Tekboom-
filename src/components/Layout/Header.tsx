
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Header = ({ onToggleSidebar, sidebarCollapsed }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b border-[#ECEFF1] bg-white flex items-center px-4 justify-between sticky top-0 z-10 w-full">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-4"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isMobile ? (
            <Menu className="h-5 w-5 text-[#546E7A]" />
          ) : sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-[#546E7A]" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-[#546E7A]" />
          )}
        </Button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#546E7A]" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-8 bg-[#F5F9FF] border-[#ECEFF1] focus-visible:ring-[#1E88E5]"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4 text-[#546E7A]" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E88E5] text-[10px] text-white">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium">Notificações</div>
            <div className="border-t border-[#ECEFF1]" />
            <DropdownMenuItem className="p-3 cursor-pointer hover:bg-[#F5F9FF]">
              <div className="flex flex-col">
                <span className="font-medium text-[#263238]">Novo pedido recebido</span>
                <span className="text-sm text-[#546E7A]">Há 5 minutos</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 cursor-pointer hover:bg-[#F5F9FF]">
              <div className="flex flex-col">
                <span className="font-medium text-[#263238]">Estoque baixo: Produto XYZ</span>
                <span className="text-sm text-[#546E7A]">Há 30 minutos</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 cursor-pointer hover:bg-[#F5F9FF]">
              <div className="flex flex-col">
                <span className="font-medium text-[#263238]">Pagamento confirmado</span>
                <span className="text-sm text-[#546E7A]">Há 1 hora</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
