
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
import { AdminHeaderExtras } from "./AdminHeaderExtras";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Header = ({ onToggleSidebar, sidebarCollapsed }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Novo pedido recebido",
      description: "Há 5 minutos",
      time: "5m",
      read: false
    },
    {
      id: "2",
      title: "Estoque baixo: Produto XYZ",
      description: "Há 30 minutos",
      time: "30m",
      read: false
    },
    {
      id: "3",
      title: "Pagamento confirmado",
      description: "Há 1 hora",
      time: "1h",
      read: false
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Count unread notifications
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Function to mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    toast.success("Notificação marcada como lida");
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success("Todas as notificações foram marcadas como lidas");
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4 text-[#546E7A]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E88E5] text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex justify-between items-center p-2">
              <div className="font-medium">Notificações</div>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs text-[#1E88E5] hover:text-[#1976D2]"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            <div className="border-t border-[#ECEFF1]" />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`p-3 cursor-pointer hover:bg-[#F5F9FF] ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-[#263238]">{notification.title}</span>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 ml-2 mt-1"></span>
                      )}
                    </div>
                    <span className="text-sm text-[#546E7A]">{notification.description}</span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <div className="border-t border-[#ECEFF1] p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-[#1E88E5]"
                onClick={() => toast.info("Visualizar todas as notificações")}
              >
                Ver todas as notificações
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
