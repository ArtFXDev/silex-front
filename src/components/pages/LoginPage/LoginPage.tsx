import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Fade,
  Grid,
  TextField,
} from "@mui/material";
import SilexText from "assets/images/silex_text.png";
import ProdBadge from "components/common/chips/ProdBetaDevChip";
import NimbyController from "components/common/NimbyController/NimbyController";
import OpenLogsButton from "components/common/OpenLogsButton/OpenLogsButton";
import SilexLogo from "components/common/SilexLogo/SilexLogo";
import { useAuth, useSocket } from "context";
import isElectron from "is-electron";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import * as Zou from "utils/zou";

const SilexLogoAndText = (): JSX.Element => (
  <Grid
    item
    sx={{
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    }}
  >
    <SilexLogo size={150} sx={{ marginBottom: "15px" }} />
    <img
      src={SilexText}
      alt="silex text"
      width={80}
      style={{ marginBottom: "25px" }}
    />
  </Grid>
);

const LoginPage = (): JSX.Element => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const auth = useAuth();
  const location = useLocation<{ from: Location }>();
  const socket = useSocket();
  const history = useHistory();

  /**
   * Called when the user press the login button
   */
  const onLogIn = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setEmail("");
      setPassword("");
      setIsLoading(false);
      setError("Some fields are required");
      return;
    }

    setIsLoading(true);

    Zou.login({ email, password })
      .then((response) => {
        const { from } = location.state || { from: { pathname: "/" } };
        auth.signin(response.data.user);

        // Redirect to the asked page
        history.replace(from);
      })
      .catch((error) => {
        setIsLoading(false);

        if (error.response) {
          setError(
            `User or password invalid\nError code: ${error.response.status} - ${error.response.statusText}`
          );
        } else {
          setError(
            `Zou server at ${process.env.REACT_APP_ZOU_API} is not reachable, check your internet connection or retry later`
          );
        }
      });
  };

  // TODO: better regexp?
  const validateEmail = (s: string): boolean =>
    /[a-z0-9]+@[a-z0-9]+\.[a-z]+/.test(s);
  const isEmailError = email !== undefined && !validateEmail(email);
  const isPasswordError = password !== undefined && password.length === 0;

  return (
    <div style={{ position: "relative" }}>
      <Fade in>
        <Box
          component="form"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Grid
            container
            spacing={3}
            alignItems="center"
            flexDirection="column"
            maxWidth="50%"
          >
            <SilexLogoAndText />

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="email"
                label="Email"
                size="small"
                required
                error={isEmailError}
                helperText={
                  isEmailError
                    ? email.length === 0
                      ? "Email cannot be empty"
                      : "Incorrect email"
                    : null
                }
                color={
                  email === undefined
                    ? "info"
                    : isEmailError
                    ? "error"
                    : "success"
                }
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                type="password"
                label="Password"
                size="small"
                required
                error={isPasswordError}
                helperText={isPasswordError ? "Password cannot be empty" : null}
                color={
                  password === undefined
                    ? "info"
                    : isPasswordError
                    ? "error"
                    : "success"
                }
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={onLogIn}
                  disabled={!socket.isConnected}
                  sx={{
                    textTransform: "none",
                    width: 100,
                  }}
                >
                  Log In
                </Button>

                <Collapse in={isLoading} orientation="horizontal">
                  <CircularProgress size={20} sx={{ ml: 3 }} />
                </Collapse>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Collapse in={error !== undefined || !socket.isConnected}>
                <Alert severity="error" variant="outlined">
                  {!socket.isConnected
                    ? "The application is not connected to the WebSocket server. You can't login."
                    : error}
                </Alert>
              </Collapse>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          flexDirection: "column",
        }}
      >
        {isElectron() && <NimbyController />}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 15,
          right: 20,
        }}
      >
        <OpenLogsButton />
        <ProdBadge />
      </div>
    </div>
  );
};

export default LoginPage;
