import { createContext, ReactNode, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/lib/mock-data";

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
    const foundUser = mockUsers.find(u => u.username === username);

    if (foundUser && password === "password") {
      setUser(foundUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.username}!`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const register = (username: string, password: string, role: UserRole) => {
    setIsLoading(true);
    if (mockUsers.some(u => u.username === username)) {
      toast({
        title: "Registration failed",
        description: "Username already exists",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      username,
      role,
    };
    mockUsers.push(newUser);
    setUser(newUser);
    toast({
      title: "Registration successful",
      description: "Your account has been created",
    });
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