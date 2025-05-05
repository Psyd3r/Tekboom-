
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface NewUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    fullName: string;
    email: string;
    password: string;
  };
  onUserDataChange: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function NewUserDialog({
  isOpen,
  onOpenChange,
  userData,
  onUserDataChange,
  onSubmit
}: NewUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Adicione um novo usuário administrativo para acessar o sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">Nome Completo</label>
            <Input
              id="fullName"
              value={userData.fullName}
              onChange={(e) => onUserDataChange({ ...userData, fullName: e.target.value })}
              placeholder="Nome Completo"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => onUserDataChange({ ...userData, email: e.target.value })}
              placeholder="email@exemplo.com"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Senha</label>
            <Input
              id="password"
              type="password"
              value={userData.password}
              onChange={(e) => onUserDataChange({ ...userData, password: e.target.value })}
              placeholder="••••••••"
              minLength={6}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">A senha deve ter pelo menos 6 caracteres</p>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full">Criar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
