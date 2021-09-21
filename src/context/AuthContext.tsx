import React, { useContext, useState } from "react";
import { User, Project, ProjectId } from "types";
import * as Kitsu from "utils/kitsu";

export interface AuthContext {
  user: User | null;
  projects: Project[] | null;
  signin: (user: User) => void;
  signout: () => void;
  currentProject: ProjectId | null;
  setCurrentProject: (id: ProjectId) => void;
}

// Hack to set the default context (not available until we query the server)
// See: https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const authContext = React.createContext<AuthContext>({} as AuthContext);

export const ProvideAuth: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentProject, setCurrentProjectState] = useState<ProjectId | null>(
    null
  );
  const [projects, setProjects] = useState<Project[] | null>(null);

  const signin = (user: User) => {
    setUser(new User(user));
    Kitsu.getUserProjects().then((response) => setProjects(response.data));
  };

  const signout = () => {
    setUser(null);
  };

  const setCurrentProject = (id: ProjectId) => {
    setCurrentProjectState(id);
  };

  return (
    <authContext.Provider
      value={{
        user,
        projects,
        currentProject,
        setCurrentProject,
        signin,
        signout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
