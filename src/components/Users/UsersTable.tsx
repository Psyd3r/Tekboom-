
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, User } from "lucide-react";
import { type Profile } from "@/hooks/useUsers";

interface UsersTableProps {
  users: Profile[];
  isLoading: boolean;
  error: Error | null;
  currentUserId?: string;
  searchTerm: string;
  formatDate: (date: string) => string;
  onDeleteUser: (id: string) => void;
}

export function UsersTable({
  users,
  isLoading,
  error,
  currentUserId,
  searchTerm,
  formatDate,
  onDeleteUser
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-gray-500">Carregando usuários...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500 flex items-center">
          <User className="mr-2 h-5 w-5" />
          Erro ao carregar usuários
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="h-32 text-center">
              <div className="flex flex-col items-center justify-center p-4">
                <User className="h-8 w-8 text-gray-400 mb-2" />
                {searchTerm ? (
                  <p className="text-gray-500">Nenhum usuário encontrado para "{searchTerm}"</p>
                ) : (
                  <p className="text-gray-500">Nenhum usuário cadastrado ainda</p>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className="w-24">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="group">
            <TableCell>
              <div className="flex items-center">
                <div className="bg-gray-100 p-1 rounded-full mr-3">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{user.full_name || "—"}</div>
                  {user.id === currentUserId && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Você</span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
            <TableCell>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDeleteUser(user.id)}
                  disabled={user.id === currentUserId}
                  className={`
                    opacity-0 group-hover:opacity-100 transition-opacity
                    ${user.id === currentUserId ? "cursor-not-allowed" : ""}
                  `}
                  title={user.id === currentUserId ? "Você não pode excluir sua própria conta" : "Excluir usuário"}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
