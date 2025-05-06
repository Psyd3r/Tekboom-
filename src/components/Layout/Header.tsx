
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminHeaderExtras } from "./AdminHeaderExtras";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Header = ({ onToggleSidebar, sidebarCollapsed }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b border-[#ECEFF1] bg-white flex items-center px-4 justify-between sticky top-0 z-20 w-full shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-4 text-primary"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isMobile ? (
            <Menu className="h-5 w-5" />
          ) : sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
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
        <AdminHeaderExtras />
      </div>
    </header>
  );
};
