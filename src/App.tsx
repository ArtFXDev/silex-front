import ActionPage from "components/pages/ActionPage/ActionPage";
import DCCClientsPage from "components/pages/DCCClientsPage/DCCClientsPage";
import ExplorerPage from "components/pages/ExplorerPage/ExplorerPage";
import HomePage from "components/pages/HomePage/HomePage";
import LoginPage from "components/pages/LoginPage/LoginPage";
import LogsPage from "components/pages/LogsPage/LogsPage";
import NotFoundPage from "components/pages/NotFoundPage/NotFoundPage";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";
import PrivateRoute from "components/utils/PrivateRoute/PrivateRoute";
import {
  ProvideAction,
  ProvideAuth,
  ProvideGraphQLClient,
  ProvideSocket,
} from "context";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/**
 * This is the main App component.
 * The context providers wraps all the components to get access to data globally.
 * This is where we also put all the pages and their routes
 */
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

                  <PrivateRoute exact path="/logs">
                    <LogsPage />
                  </PrivateRoute>

                  <PrivateRoute exact path="/">
                    <HomePage />
                  </PrivateRoute>

                  <PrivateRoute exact path="/profile">
                    <ProfilePage />
                  </PrivateRoute>

                  <PrivateRoute exact path="/dccs">
                    <DCCClientsPage />
                  </PrivateRoute>

                  <PrivateRoute exact path="/action">
                    <ActionPage />
                  </PrivateRoute>

                  <PrivateRoute path="/explorer">
                    <ExplorerPage />
                  </PrivateRoute>

                  <Route path="/*">
                    <NotFoundPage />
                  </Route>
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
