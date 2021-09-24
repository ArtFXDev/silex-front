import React, { useEffect, useState } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

import * as Kitsu from "utils/kitsu";
import { useAuth } from "context";

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  const auth = useAuth();
  const location = useLocation();

  const isTheRightRoute = rest.path === location.pathname;

  useEffect(() => {
    const checkIfUserLoggedIn = async () => {
      try {
        const response = await Kitsu.isAuthenticated();
        auth.signin(response.data.user);
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
      if (isTheRightRoute && loading) checkIfUserLoggedIn();
    }
  }, [auth, isTheRightRoute, isUserLoggedIn, loading]);

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
