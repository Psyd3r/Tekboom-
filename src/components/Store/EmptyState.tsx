
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  icon?: ReactNode;
}

export const EmptyState = ({
  title,
  description = "Não há conteúdo disponível no momento.",
  actionText = "Ver todos os produtos",
  actionLink = "/store/produtos",
  icon = <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {actionText && actionLink && (
        <Button asChild>
          <Link to={actionLink}>{actionText}</Link>
        </Button>
      )}
    </div>
  );
};
