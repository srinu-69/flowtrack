// for UI/UX

import React, { createContext, useContext, useState, useEffect } from "react"; // <-- CORRECTED LINE

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      console.log(
        "AuthContext: Starting initial user load from localStorage...",
      );
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.email && parsedUser.id) {
            setUser(parsedUser);
            // FIX: Changed 'parsed.email' to 'parsedUser.email' as 'parsed' was undefined
            console.log(
              "AuthContext: User found in localStorage:",
              parsedUser.email,
            );
          } else {
            console.warn(
              "AuthContext: Malformed user data in localStorage, clearing it.",
            );
            localStorage.removeItem("user");
          }
        } else {
          console.log("AuthContext: No user found in localStorage.");
        }
      } catch (error) {
        console.error(
          "AuthContext: Error parsing user from localStorage:",
          error,
        );
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
        console.log(
          "AuthContext: Initial user load finished. Loading state set to false.",
        );
      }
    };

    loadUser();
  }, []);

  // --- REAL LOGIN FUNCTION ---
  const login = async (email, password) => {
    setLoading(true);
    console.log(`AuthContext: Login attempt for email: ${email}`);
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const userData = await response.json();
      
      // Transform backend response to frontend format
      const frontendUserData = {
        id: userData.id,
        name: userData.full_name || email.split("@")[0] || "User",
        email: userData.email,
        token: "real-jwt-token", // In a real app, this would come from the backend
      };

      setUser(frontendUserData);
      localStorage.setItem("user", JSON.stringify(frontendUserData));
      console.log("AuthContext: Login successful! User set and stored.", frontendUserData);
      return frontendUserData;
    } catch (error) {
      console.error("AuthContext: Login failed:", error.message);
      setUser(null);
      localStorage.removeItem("user");
      throw error;
    } finally {
      setLoading(false);
      console.log("AuthContext: Login process finished. Loading state set to false.");
    }
  };
  // --- END OF REAL LOGIN FUNCTION ---

  // --- REAL REGISTRATION FUNCTION ---
  const register = async (email, password, fullName) => {
    setLoading(true);
    console.log(`AuthContext: Registration attempt for email: ${email}`);
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          full_name: fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const userData = await response.json();
      
      // Transform backend response to frontend format
      const frontendUserData = {
        id: userData.id,
        name: userData.full_name || email.split("@")[0] || "User",
        email: userData.email,
        token: "real-jwt-token", // In a real app, this would come from the backend
      };

      setUser(frontendUserData);
      localStorage.setItem("user", JSON.stringify(frontendUserData));
      console.log("AuthContext: Registration successful! User set and stored.", frontendUserData);
      return frontendUserData;
    } catch (error) {
      console.error("AuthContext: Registration failed:", error.message);
      setUser(null);
      localStorage.removeItem("user");
      throw error;
    } finally {
      setLoading(false);
      console.log("AuthContext: Registration process finished. Loading state set to false.");
    }
  };
  // --- END OF REAL REGISTRATION FUNCTION ---

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
