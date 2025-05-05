
import { motion } from "framer-motion";
import { Search, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewUserDialog } from "@/components/Users/NewUserDialog";
import { UsersTable } from "@/components/Users/UsersTable";
import { UserStats } from "@/components/Users/UserStats";
import { useUsers } from "@/hooks/useUsers";

const Users = () => {
  const {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    isDialogOpen,
    setIsDialogOpen,
    newUserData,
    setNewUserData,
    handleCreateUser,
    handleDeleteUser,
    formatDate,
    currentUser
  } = useUsers();

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários Administrativos</h1>
          <p className="text-gray-500 mt-1">Gerencie o acesso de usuários ao sistema</p>
        </div>
        
        <NewUserDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          userData={newUserData}
          onUserDataChange={setNewUserData}
          onSubmit={handleCreateUser}
        />
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-[#FF5722]" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>
                Usuários com acesso administrativo ao sistema
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar usuário"
                className="pl-9 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <UsersTable 
              users={filteredUsers}
              isLoading={isLoading}
              error={error}
              currentUserId={currentUser?.id}
              searchTerm={searchTerm}
              formatDate={formatDate}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        </CardContent>
      </Card>

      <UserStats users={filteredUsers} formatDate={formatDate} />
    </motion.div>
  );
};

export default Users;
