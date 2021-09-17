import React, { useContext, useState } from "react";
import { User } from "./User";

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
    setUser(new User(user));
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
