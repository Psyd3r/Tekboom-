
import { AdminStoreLink } from "@/components/Store/AdminStoreLink";
import { useIsMobile } from "@/hooks/use-mobile";

export const AdminHeaderExtras = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center">
      {!isMobile && <AdminStoreLink />}
    </div>
  );
};
