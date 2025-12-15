import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const getToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    //load user on mount
    getUser();
  }, []);
  const getUser = () => {
    if (user) return user;
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      return parsedUser;
    }
    return null;
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return {
    getToken,
    isAuthenticated,
    logout,
    user,
  };
}
