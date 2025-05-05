
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirecionar para a página de produtos com o parâmetro de busca
      navigate(`/store/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex w-full ${className}`}>
      <Input
        type="text"
        placeholder="O que você está procurando?"
        className="rounded-r-none border-r-0 focus-visible:ring-[#1E88E5]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Campo de pesquisa"
      />
      <Button 
        type="submit"
        variant="default" 
        size="icon" 
        className="rounded-l-none bg-[#1E88E5] hover:bg-[#1976D2]"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Pesquisar</span>
      </Button>
    </form>
  );
};
