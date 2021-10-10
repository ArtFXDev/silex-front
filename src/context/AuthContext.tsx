import { useApolloClient } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Person, Project, ProjectId } from "types/entities";
import * as Zou from "utils/zou";

export interface AuthContext {
  user: Person | undefined;
  projects: Project[] | undefined;
  signin: (user: Person) => Promise<void>;
  signout: () => void;
  currentProjectId: ProjectId | undefined;
  setCurrentProjectId: (id: ProjectId) => void;
  getCurrentProject: () => Project | undefined;
}

// Hack to set the default context (not available until we query the server)
// See: https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const authContext = React.createContext<AuthContext>({} as AuthContext);

interface ProvideAuthProps {
  children: JSX.Element;
}

export const ProvideAuth = ({ children }: ProvideAuthProps): JSX.Element => {
  const [user, setUser] = useState<Person>();
  const [currentProjectId, setCurrentProjectId] = useState<ProjectId>();
  const [projects, setProjects] = useState<Project[]>();

  const client = useApolloClient();

  const signin = async (user: Person) => {
    setUser(user);

    // Store the list of projects for that user
    const projectsData = await Zou.getUserProjects();
    setProjects(projectsData.data);

    // And the current project id
    if (projectsData.data.length !== 0) {
      setCurrentProjectId(projectsData.data[0].id);
    }
  };

  const signout = () => {
    setUser(undefined);

    // Clear the GraphQL store
    // See: https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout
    client.clearStore();
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

export const useAuth = (): AuthContext => useContext(authContext);
