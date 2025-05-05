
import { AdminStoreLink } from "@/components/Store/AdminStoreLink";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export const AdminHeaderExtras = () => {
  const isMobile = useIsMobile();
  
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
    </div>
  );
};
