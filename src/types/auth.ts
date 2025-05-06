
import { Session, User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'customer' | null;

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role?: 'admin' | 'customer') => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}
