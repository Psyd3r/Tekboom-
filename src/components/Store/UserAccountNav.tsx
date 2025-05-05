
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

export const UserAccountNav = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/store/minha-conta" className="flex items-center">
        <UserRound className="h-4 w-4 mr-2" />
        Minha Conta
      </Link>
    </Button>
  );
};
