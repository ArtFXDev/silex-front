import React, { useContext, useState } from "react";
import { User, Project, ProjectId } from "types";
import * as Kitsu from "utils/kitsu";

export interface AuthContext {
  user: User | undefined;
  projects: Project[] | undefined;
  signin: (user: User) => Promise<void>;
  signout: () => void;
  currentProjectId: ProjectId | undefined;
  setCurrentProjectId: (id: ProjectId) => void;
  getCurrentProject: () => Project | undefined;
}

// Hack to set the default context (not available until we query the server)
// See: https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const authContext = React.createContext<AuthContext>({} as AuthContext);

export const ProvideAuth: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [currentProjectId, setCurrentProjectId] = useState<ProjectId>();
  const [projects, setProjects] = useState<Project[]>();

  const signin = async (user: User) => {
    setUser(new User(user));

    // Store the list of projects for that user
    const projectsData = await Kitsu.getUserProjects();
    setProjects(projectsData.data);

    // And the current project id
    setCurrentProjectId(projectsData.data[0].id);
  };

  const signout = () => {
    setUser(undefined);
  };

  const getCurrentProject = () => {
    return projects?.find((p) => p.id === currentProjectId);
  };

  return (
    <authContext.Provider
      value={{
        user,
        projects,
        currentProjectId,
        setCurrentProjectId,
        getCurrentProject,
        signin,
        signout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
