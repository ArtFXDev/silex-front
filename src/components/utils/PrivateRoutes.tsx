import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "~/context";
import * as Api from "~/utils/zou";

/**
 * Private routes guard that checks if the user is authenticated
 * If not, it redirects to /login
 *
 * <Route element={<PrivateRoutes />}>
 *   <Route path="/" element={<HomePage />} />
 * </Route>
 */
const PrivateRoutes = (): JSX.Element => {
  const [loading, setLoading] = useState(true);

  const auth = useAuth();

  useEffect(() => {
    const login = async () => {
      const authResponse = await Api.isAuthenticated();
      if (!authResponse.authenticated) throw Error("Not authenticated");
      await auth.signin(authResponse.user);
    };

    login().finally(() => setLoading(false));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  if (loading) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
