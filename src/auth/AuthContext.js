import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth({
        token,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (token) => {
    setAuth({
      token,
      isAuthenticated: true,
    });
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setAuth({
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
