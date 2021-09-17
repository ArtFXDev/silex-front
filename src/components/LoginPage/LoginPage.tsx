import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";

import { useState } from "react";
import { useAuth, User } from "../../context/AuthContext";
import { useHistory, useLocation } from "react-router-dom";

const LoginPage: React.FC = (props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  const auth = useAuth();
  const location = useLocation<{ from: Location }>();
  const history = useHistory();

  const onLogIn = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    axios
      .post<{ user: User }>("http://localhost/api/auth/login", {
        email,
        password,
      })
      .then((response) => {
        const { from } = location.state || { from: { pathname: "/" } };
        auth.signin(response.data.user);
        history.replace(from);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          setError(
            `User or password invalid\nError code: ${error.response.status} - ${error.response.statusText}`
          );
        }
      });
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            type="email"
            label="Email"
            size="small"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            type="password"
            label="Password"
            size="small"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={onLogIn}
          >
            Log In
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default LoginPage;
