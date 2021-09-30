import React, { useEffect, useState } from "react";
import { Redirect, Route, RouteProps, useRouteMatch } from "react-router-dom";
import { CircularProgress, Backdrop } from "@mui/material";

import * as Kitsu from "utils/kitsu";
import { useAuth } from "context";

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const auth = useAuth();
  const routeMatch = useRouteMatch();

  const isTheRightRoute = routeMatch.isExact
    ? rest.path === routeMatch.url
    : routeMatch.url.includes(rest.path as string);

  useEffect(() => {
    const checkIfUserLoggedIn = async () => {
      try {
        setFetching(true);
        const response = await Kitsu.isAuthenticated();
        await auth.signin(response.data.user);
        setFetching(false);
        setIsUserLoggedIn(true);
      } catch (err) {
        setIsUserLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    if (auth.user && auth.currentProjectId) {
      setIsUserLoggedIn(true);
      setLoading(false);
    } else {
      if (isTheRightRoute && !isUserLoggedIn && !fetching)
        checkIfUserLoggedIn();
    }
  }, [auth, isTheRightRoute, isUserLoggedIn, loading, fetching]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loading ? (
          <Backdrop open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : !isUserLoggedIn ? (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
};

export default PrivateRoute;
