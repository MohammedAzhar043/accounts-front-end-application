import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api"; 
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Run once when app starts
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const user = await getUserProfile();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Get profile of current user
  const getUserProfile = async () => {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Login (call backend)
  const login = async (username, password) => {
    try {
      const response = await api.post("/login", {
        username,
        password,
      });

      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      const user = await getUserProfile();
      setCurrentUser(user);

      //toast.success("Login successful ");
    } catch (error) {
      // toast.error("Invalid credentials");
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("access_token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading: loading,
        login,
        logout,
        getUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy usage
export const useAuth = () => useContext(AuthContext);
