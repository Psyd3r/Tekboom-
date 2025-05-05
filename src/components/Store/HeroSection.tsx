
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_url: string;
  order_index: number;
  active: boolean;
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
}

export const HeroSection = ({
  title = "Produtos de alta qualidade para você",
  subtitle = "Encontre as melhores ofertas para seu dia a dia",
  ctaText = "Ver produtos",
  ctaLink = "/store/produtos",
  imageUrl = "https://placehold.co/1200x600",
}: HeroSectionProps) => {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['store-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .order('order_index');
      
      if (error) {
        console.error('Error fetching banners:', error);
        return [];
      }
      
      return data as Banner[];
    }
  });

  // Fallback banner for when there are no banners in the database
  const fallbackBanner = {
    title,
    subtitle,
    buttonText: ctaText,
    buttonLink: ctaLink,
    imageUrl
  };

  // If no banners are available, use the fallback
  if (banners.length === 0 && !isLoading) {
    return (
      <SingleBanner 
        title={fallbackBanner.title} 
        subtitle={fallbackBanner.subtitle} 
        buttonText={fallbackBanner.buttonText} 
        buttonLink={fallbackBanner.buttonLink} 
        imageUrl={fallbackBanner.imageUrl}
      />
    );
  }

  return (
    <div className="relative">
      {isLoading ? (
        <div className="h-[300px] bg-blue-100 animate-pulse rounded-lg"></div>
      ) : banners.length === 1 ? (
        <SingleBanner 
          title={banners[0].title} 
          subtitle={banners[0].subtitle || ""} 
          buttonText={banners[0].button_text} 
          buttonLink={banners[0].button_link} 
          imageUrl={banners[0].image_url || imageUrl}
        />
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <SingleBanner 
                  title={banner.title} 
                  subtitle={banner.subtitle || ""} 
                  buttonText={banner.button_text} 
                  buttonLink={banner.button_link} 
                  imageUrl={banner.image_url || imageUrl}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      )}
    </div>
  );
};

// Helper component for a single banner
const SingleBanner = ({ 
  title, 
  subtitle, 
  buttonText, 
  buttonLink, 
  imageUrl 
}: { 
  title: string; 
  subtitle: string; 
  buttonText: string; 
  buttonLink: string; 
  imageUrl: string;
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-[#0D47A1] text-white">
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover mix-blend-overlay opacity-30"
        />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
          <p className="text-lg opacity-90 mb-8">{subtitle}</p>
          <Button 
            asChild 
            size="lg" 
            className="group bg-[#1E88E5] hover:bg-[#1976D2]"
          >
            <Link to={buttonLink}>
              {buttonText}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
