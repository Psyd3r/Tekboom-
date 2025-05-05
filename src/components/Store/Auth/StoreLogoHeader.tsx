
import { Store } from "lucide-react";

export const StoreLogoHeader = () => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center gap-2">
        <Store className="h-7 w-7 text-primary" />
        <span className="font-bold text-xl">Teekbom</span>
      </div>
    </div>
  );
};
