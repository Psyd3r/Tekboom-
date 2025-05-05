
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Profile } from "@/hooks/useUsers";

interface UserStatsProps {
  users: Profile[];
  formatDate: (date: string) => string;
}

export function UserStats({ users, formatDate }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase font-semibold text-gray-500">Total de Usuários</CardDescription>
          <CardTitle className="text-2xl">{users.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Usuários com acesso ao sistema</p>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase font-semibold text-gray-500">Último Usuário Adicionado</CardDescription>
          <CardTitle className="text-lg truncate">
            {users.length > 0 ? (users[0].full_name || users[0].email) : "Nenhum usuário"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            {users.length > 0 ? `Adicionado em ${formatDate(users[0].created_at)}` : "Adicione seu primeiro usuário"}
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md bg-gray-50">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs uppercase font-semibold text-gray-500">Segurança</CardDescription>
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            Controle de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Gerencie permissões e acesso ao sistema
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
