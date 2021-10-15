import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  TextField,
} from "@mui/material";
import SilexLogo from "assets/images/silex_logo.png";
import SilexText from "assets/images/silex_text.png";
import { useAuth } from "context";
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
    <img
      src={SilexLogo}
      alt="silex logo"
      width={150}
      height={150}
      style={{ marginBottom: "15px" }}
    />
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
  const history = useHistory();

  /**
   * Called when the user press the login button
   */
  const onLogIn = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setEmail("");
      setPassword("");
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
  const validateEmail = (s: string): boolean => /[a-z]+@[a-z]+\.[a-z]+/.test(s);
  const isEmailError = email !== undefined && !validateEmail(email);
  const isPasswordError = password !== undefined && password.length === 0;

  return (
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
              email === undefined ? "info" : isEmailError ? "error" : "success"
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
          <Collapse in={error !== undefined}>
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          </Collapse>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
