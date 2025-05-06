
import { Store } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Logo {
  id: string;
  imageUrl: string;
  altText: string;
}

export const AdminLogo = ({ collapsed = false }) => {
  const { data: logoConfig } = useQuery({
    queryKey: ['admin-logo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'logo')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      try {
        return data.value as unknown as Logo;
      } catch (e) {
        console.error("Error parsing logo data:", e);
        return null;
      }
    },
  });

  return (
    <div className="flex items-center justify-center">
      {logoConfig?.imageUrl ? (
        <img 
          src={logoConfig.imageUrl} 
          alt={logoConfig.altText || "Teekbom Admin"} 
          className={collapsed ? "h-8 w-auto" : "h-10 w-auto"} 
        />
      ) : (
        <div className={`flex items-center ${collapsed ? "justify-center" : ""}`}>
          <Store className="h-6 w-6 text-white" />
          {!collapsed && (
            <span className="ml-2 font-bold text-lg text-white">Teekbom</span>
          )}
        </div>
      )}
    </div>
  );
};
