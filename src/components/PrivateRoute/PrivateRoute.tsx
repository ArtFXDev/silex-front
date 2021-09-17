import axios from "axios";
import React, { useEffect, useState } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Props = RouteProps & { isLoginPage?: boolean };

const PrivateRoute: React.FC<Props> = ({ children, isLoginPage, ...rest }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const auth = useAuth();

  useEffect(() => {
    const isServerLoggedIn = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_KITSU_URL}/api/auth/authenticated`
        );

        console.log("IS USER AUTH? ", response);
        setIsUserLoggedIn(true);
      } catch (err) {
        console.log("THE SERVER SAYS THAT USER IS NOT AUTH ", err);
        setIsUserLoggedIn(false);
      }
    };

    if (auth.user) {
      console.log("USER IS LOGGED IN", auth.user);
      setIsUserLoggedIn(true);
    } else {
      isServerLoggedIn();
    }
  }, [isUserLoggedIn, auth.user]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isUserLoggedIn || isLoginPage ? (
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
