
import { Store } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Logo {
  id: string;
  imageUrl: string;
  altText: string;
  storeName?: string;
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

  // Nome padrão da loja se não existir na config
  const storeName = logoConfig?.storeName || "Teekbom";

  return (
    <div className="flex items-center justify-center">
      {logoConfig?.imageUrl ? (
        <div className="flex flex-col items-center">
          <img 
            src={logoConfig.imageUrl} 
            alt={logoConfig.altText || "Teekbom Admin"} 
            className={collapsed ? "h-8 w-auto" : "h-10 w-auto"} 
          />
          {!collapsed && (
            <span className="font-bold text-lg text-white">{storeName}</span>
          )}
        </div>
      ) : (
        <div className={`flex flex-col items-center ${collapsed ? "justify-center" : ""}`}>
          <Store className="h-6 w-6 text-white" />
          {!collapsed && (
            <span className="font-bold text-lg text-white">{storeName}</span>
          )}
        </div>
      )}
    </div>
  );
};
