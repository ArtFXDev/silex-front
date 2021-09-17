import React, { useEffect, useState } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

import * as Kitsu from "utils/kitsu";
import { useAuth } from "context/AuthContext";

type Props = RouteProps & { isLoginPage?: boolean };

const PrivateRoute: React.FC<Props> = ({ children, isLoginPage, ...rest }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | undefined>(
    undefined
  );
  const auth = useAuth();

  useEffect(() => {
    const isServerLoggedIn = async () => {
      try {
        const response = await Kitsu.isAuthenticated();

        setIsUserLoggedIn(true);
        auth.signin(response.data.user);
      } catch (err) {
        setIsUserLoggedIn(false);
      }
    };

    if (auth.user) {
      setIsUserLoggedIn(true);
    } else {
      isServerLoggedIn();
    }
  }, [isUserLoggedIn, auth, auth.user]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isUserLoggedIn === undefined ? (
          <Backdrop open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : isUserLoggedIn || isLoginPage ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
