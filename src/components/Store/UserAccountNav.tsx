
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";

export const UserAccountNav = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col items-center text-gray-700 hover:text-[#1E88E5]">
      <UserRound className="h-5 w-5" />
      <Link to="/store/perfil" className="text-xs">
        Minha Conta
      </Link>
    </div>
  );
};
