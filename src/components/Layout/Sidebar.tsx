
import React, { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sidebarLinks } from "./SidebarLinks";
import { useIsMobile } from "@/hooks/use-mobile";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, collapsed = false, onClose }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !onClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, onClose]);

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "fixed z-30 h-full bg-sidebar-DEFAULT text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        isMobile && collapsed && "-translate-x-full",
        isMobile && !collapsed && "translate-x-0",
        className
      )}
    >
      <ScrollArea className="h-full">
        <div className="space-y-4 py-4">
          <div className="px-4 py-2">
            {!collapsed ? (
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight overflow-hidden whitespace-nowrap">
                Teekbom Admin
              </h2>
            ) : (
              <h2 className="mb-2 px-2 text-center text-lg font-semibold tracking-tight overflow-hidden">
                TB
              </h2>
            )}
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.active(location.pathname);
                
                return (
                  <Button
                    key={link.href}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2"
                    )}
                    asChild
                  >
                    <Link to={link.href}>
                      <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                      {!collapsed && <span>{link.label}</span>}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
