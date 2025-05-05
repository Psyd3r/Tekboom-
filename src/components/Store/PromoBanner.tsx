
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  highlightText?: string;
}

export const PromoBanner = ({
  title = "Oferta Especial",
  subtitle = "Aproveite 15% de desconto em toda a loja!",
  buttonText = "Ver Ofertas",
  buttonLink = "/store/ofertas",
  highlightText = "15% OFF"
}: PromoBannerProps) => {

  const { data: promoBanner } = useQuery({
    queryKey: ['promo-banner'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'promo_banner')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No banner found, returning null
          return null;
        }
        throw error;
      }
      
      try {
        return data.value as {
          title: string;
          subtitle: string;
          buttonText: string;
          buttonLink: string;
          highlightText: string;
        };
      } catch (e) {
        return null;
      }
    }
  });

  // Use database values or fallback to props
  const displayTitle = promoBanner?.title || title;
  const displaySubtitle = promoBanner?.subtitle || subtitle;
  const displayButtonText = promoBanner?.buttonText || buttonText;
  const displayButtonLink = promoBanner?.buttonLink || buttonLink;
  const displayHighlightText = promoBanner?.highlightText || highlightText;
  
  return (
    <section className="relative overflow-hidden rounded-lg py-12 px-6 bg-gradient-to-r from-[#64B5F6] to-[#1E88E5] text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{displayTitle}</h2>
          <p className="text-lg opacity-90 mb-4">{displaySubtitle}</p>
          <Button className="bg-white text-primary hover:bg-gray-100">
            <Link to={displayButtonLink}>{displayButtonText}</Link>
          </Button>
        </div>
        <div className="text-6xl md:text-8xl font-bold">{displayHighlightText}</div>
      </div>
    </section>
  );
};
