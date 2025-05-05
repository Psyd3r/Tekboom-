
import { AdminStoreLink } from "@/components/Store/AdminStoreLink";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { LogOut, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AdminHeaderExtras = () => {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  
  return (
    <div className="flex items-center gap-2">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 sm:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-[#546E7A]" />
        </Button>
      )}
      <AdminStoreLink />
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={signOut}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};
