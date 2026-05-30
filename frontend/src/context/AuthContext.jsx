import React, { createContext, useState, useContext } from "react";
import api from "../configs/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = ({ user }) => {
    setUser(user);
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    try {
      await api.post("/api/users/logout");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        setLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
