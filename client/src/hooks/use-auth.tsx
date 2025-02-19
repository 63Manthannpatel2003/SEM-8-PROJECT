import { createContext, ReactNode, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockLogin, mockRegister } from "@/lib/mock-data";

type UserRole = "admin" | "project_manager" | "developer";

interface User {
  id: number;
  username: string;
  role: UserRole;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => void;
  register: (username: string, password: string, role: UserRole) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = (username: string, password: string) => {
    setIsLoading(true);
    try {
      const authenticatedUser = mockLogin(username, password);
      setUser(authenticatedUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${authenticatedUser.username}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const register = (username: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const newUser = mockRegister(username, password, role);
      setUser(newUser);
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}