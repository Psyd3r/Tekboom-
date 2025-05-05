
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { StoreLogoHeader } from "@/components/Store/Auth/StoreLogoHeader";
import { CustomerAccessNotice } from "@/components/Store/Auth/CustomerAccessNotice";
import { LoginForm } from "@/components/Store/Auth/LoginForm";
import { RegisterForm } from "@/components/Store/Auth/RegisterForm";
import { AdminLoginLink } from "@/components/Store/Auth/AdminLoginLink";

const LoginPage = () => {
  return (
    <motion.div 
      className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md border border-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StoreLogoHeader />
      <CustomerAccessNotice />
      
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-0">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="register" className="mt-0">
          <RegisterForm />
        </TabsContent>
      </Tabs>
      
      <AdminLoginLink />
    </motion.div>
  );
};

export default LoginPage;
