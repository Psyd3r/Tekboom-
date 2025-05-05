
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export const HeroSection = ({
  title = "Produtos de alta qualidade para você",
  subtitle = "Encontre as melhores ofertas para seu dia a dia",
  ctaText = "Ver produtos",
  ctaLink = "/store/produtos",
  imageUrl = "https://placehold.co/1200x600",
}: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-[#0D47A1] text-white">
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl} 
          alt="Hero background" 
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
            <Link to={ctaLink}>
              {ctaText}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
