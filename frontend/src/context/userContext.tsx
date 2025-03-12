"use client"; // Important for using state in a server component

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import API from "@/utils/api";

// Define the User type
interface User {
  email: string;
  // Add more fields if necessary
}

// Define the context type
interface UserContextType {
  user: User | null;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/auth/user"); // Replace with your API
        setUser(response.data);
      } catch {
        setUser(null)
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
