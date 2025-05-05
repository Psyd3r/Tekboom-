
import { ShieldCheck } from "lucide-react";

export const AdminLoginLink = () => {
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-600">
      <div className="flex justify-center items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-gray-500" />
        <span>Para acesso administrativo, use o <a href="/login" className="text-primary hover:underline">login de administrador</a></span>
      </div>
    </div>
  );
};
