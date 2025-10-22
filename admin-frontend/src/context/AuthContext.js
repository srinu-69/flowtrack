










// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react"; // <-- CORRECTED LINE

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      console.log("AuthContext: Starting initial user load from localStorage...");
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.email && parsedUser.id) {
            setUser(parsedUser);
            // FIX: Changed 'parsed.email' to 'parsedUser.email' as 'parsed' was undefined
            console.log("AuthContext: User found in localStorage:", parsedUser.email);
          } else {
            console.warn("AuthContext: Malformed user data in localStorage, clearing it.");
            localStorage.removeItem("user");
          }
        } else {
          console.log("AuthContext: No user found in localStorage.");
        }
      } catch (error) {
        console.error("AuthContext: Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
        console.log("AuthContext: Initial user load finished. Loading state set to false.");
      }
    };

    loadUser();
  }, []);

  // --- ADMIN LOGIN FUNCTION ---
  const login = async (email, password) => {
    setLoading(true);
    console.log(`AuthContext: Admin login attempt for email: ${email}`);
    try {
      const response = await fetch('http://localhost:8000/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Admin login failed');
      }

      const adminData = await response.json();
      console.log("AuthContext: Admin login successful!", adminData);
      
      setUser(adminData);
      localStorage.setItem("admin_user", JSON.stringify(adminData));
      return adminData;

    } catch (error) {
      console.error("AuthContext: Admin login failed:", error.message);
      setUser(null);
      localStorage.removeItem("admin_user");
      throw new Error(error.message || "Admin login failed");
    } finally {
      setLoading(false);
      console.log("AuthContext: Admin login process finished.");
    }
  };

  // --- ADMIN REGISTER FUNCTION ---
  const register = async (fullName, email, password) => {
    setLoading(true);
    console.log(`AuthContext: Admin registration attempt for email: ${email}`);
    try {
      const response = await fetch('http://localhost:8000/auth/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Admin registration failed');
      }

      const adminData = await response.json();
      console.log("AuthContext: Admin registration successful!", adminData);
      
      setUser(adminData);
      localStorage.setItem("admin_user", JSON.stringify(adminData));
      return adminData;

    } catch (error) {
      console.error("AuthContext: Admin registration failed:", error.message);
      setUser(null);
      localStorage.removeItem("admin_user");
      throw new Error(error.message || "Admin registration failed");
    } finally {
      setLoading(false);
      console.log("AuthContext: Admin registration process finished.");
    }
  };

  const logout = () => {
    console.log("AuthContext: User logging out.");
    setLoading(true);
    setUser(null);
    localStorage.removeItem("user");
    setLoading(false);
    console.log("AuthContext: Logout complete.");
  };

  const authContextValue = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};