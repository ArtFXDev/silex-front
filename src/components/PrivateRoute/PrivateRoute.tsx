import React, { useEffect, useState } from "react";
import { Route, RouteProps, useHistory } from "react-router-dom";
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
  const history = useHistory();

  useEffect(() => {
    const isServerLoggedIn = async () => {
      try {
        const response = await Kitsu.isAuthenticated();

        setIsUserLoggedIn(true);
        auth.signin(response.data.user);
      } catch (err) {
        history.push("/login");
      }
    };

    if (auth.user) {
      setIsUserLoggedIn(true);
    } else {
      isServerLoggedIn();
    }
  }, [isUserLoggedIn, auth, auth.user, history]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isUserLoggedIn === undefined && !isLoginPage ? (
          <Backdrop open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          children
        )
      }
    />
  );
};

export default PrivateRoute;
