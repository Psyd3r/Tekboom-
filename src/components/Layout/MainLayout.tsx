
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Respond to mobile/desktop changes
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-[#F5F9FF] overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onClose={isMobile ? toggleSidebar : undefined}
      />
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 w-full", 
        !isMobile && (sidebarCollapsed ? "ml-16" : "ml-64")
      )}>
        <Header onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="animate-fade-in max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
