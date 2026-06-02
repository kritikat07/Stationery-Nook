import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("stationaryNookUser");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("stationaryNookUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("stationaryNookUser");
    }
  }, [user]);

  function login(userObj) {
    setUser(userObj);
  }

  function logout() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
