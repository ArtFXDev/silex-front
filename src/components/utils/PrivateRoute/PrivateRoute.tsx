import { Backdrop, CircularProgress } from "@mui/material";
import Header from "components/structure/Header/Header";
import { useAuth } from "context";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import * as Zou from "utils/zou";

const PrivateRoute = ({ children, ...rest }: RouteProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const auth = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const checkIfUserLoggedIn = async () => {
      try {
        setFetching(true);

        // Check if authenticated
        const response = await Zou.isAuthenticated();
        await auth.signin(response.data.user);

        setFetching(false);
        setIsUserLoggedIn(true);
      } catch (err: unknown) {
        setIsUserLoggedIn(false);
        enqueueSnackbar(`You are not authenticated. ${err}`, {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (auth.user) {
      setIsUserLoggedIn(true);
      setLoading(false);
    } else {
      if (!isUserLoggedIn && !fetching) checkIfUserLoggedIn();
    }
  }, [auth, isUserLoggedIn, loading, fetching, enqueueSnackbar]);

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
          <>
            <Header />
            {children}
          </>
        )
      }
    />
  );
};

export default PrivateRoute;
