import React, { useContext, useState } from "react";

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
}

export interface AuthContext {
  user: User | null;
  signin: (user: User) => void;
  signout: () => void;
}

export const authContext = React.createContext<AuthContext>({
  user: null,
  signin: (user) => {},
  signout: () => {},
});

export const ProvideAuth: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signin = (user: User) => {
    setUser(user);
  };

  const signout = () => {
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, signin, signout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
