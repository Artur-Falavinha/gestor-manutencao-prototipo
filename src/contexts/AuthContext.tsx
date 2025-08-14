import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'employee';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', name: 'João Silva', email: 'cliente@email.com', role: 'client' },
  { id: '2', name: 'Maria Santos', email: 'funcionario@email.com', role: 'employee' },
  { id: '3', name: 'Carlos Oliveira', email: 'carlos@email.com', role: 'client' },
  { id: '4', name: 'Ana Costa', email: 'ana@email.com', role: 'employee' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password.length > 0) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    // Add new user to mock data
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      role: 'client' // New registrations are always clients
    };
    mockUsers.push(newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};