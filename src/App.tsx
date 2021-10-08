import Header from "components/Header/Header";
import ActionPage from "components/pages/ActionPage/ActionPage";
import DCCClientsPage from "components/pages/DCCClientsPage/DCCClientsPage";
import ExplorerPage from "components/pages/ExplorerPage/ExplorerPage";
// Pages
import HomePage from "components/pages/HomePage/HomePage";
import LoginPage from "components/pages/LoginPage/LoginPage";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import {
  ProvideAction,
  ProvideAuth,
  ProvideGraphQLClient,
  ProvideSocket,
} from "context";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = (): JSX.Element => {
  return (
    <Router>
      <SnackbarProvider maxSnack={3}>
        <ProvideGraphQLClient>
          <ProvideSocket>
            <ProvideAuth>
              <ProvideAction>
                <Switch>
                  <Route exact path="/login">
                    <LoginPage />
                  </Route>

                  <>
                    <Header />

                    <PrivateRoute exact path="/">
                      <HomePage />
                    </PrivateRoute>

                    <PrivateRoute exact path="/profile">
                      <ProfilePage />
                    </PrivateRoute>

                    <PrivateRoute path="/explorer">
                      <ExplorerPage />
                    </PrivateRoute>

                    <PrivateRoute exact path="/dccs">
                      <DCCClientsPage />
                    </PrivateRoute>

                    <PrivateRoute exact path="/action">
                      <ActionPage />
                    </PrivateRoute>
                  </>
                </Switch>
              </ProvideAction>
            </ProvideAuth>
          </ProvideSocket>
        </ProvideGraphQLClient>
      </SnackbarProvider>
    </Router>
  );
};

export default App;
