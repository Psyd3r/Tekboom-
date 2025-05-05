
import { Store } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Logo {
  id: string;
  imageUrl: string;
  altText: string;
}

export const StoreLogoHeader = () => {
  const { data: logoConfig } = useQuery({
    queryKey: ['store-logo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'logo')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No logo found, returning null
          return null;
        }
        throw error;
      }
      
      try {
        // Properly cast to the Logo type with appropriate type assertions
        return data.value as unknown as Logo;
      } catch (e) {
        console.error("Error parsing logo data:", e);
        return null;
      }
    },
    staleTime: 0, // Ensure we're always getting fresh data
  });

  return (
    <div className="flex items-center gap-2">
      {logoConfig?.imageUrl ? (
        <img 
          src={logoConfig.imageUrl} 
          alt={logoConfig.altText} 
          className="h-8 w-auto object-contain" 
          onError={(e) => {
            // Fallback to icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const icon = document.createElement('div');
              icon.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" class="h-7 w-7 text-primary" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
              parent.insertBefore(icon, target);
            }
          }}
        />
      ) : (
        <Store className="h-7 w-7 text-primary" />
      )}
      <span className="font-bold text-xl">{logoConfig?.altText || "Teekbom"}</span>
    </div>
  );
};
