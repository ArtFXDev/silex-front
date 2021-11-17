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
import { ProvideBlade } from "context/BladeContext";
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
            <ProvideBlade>
              <ProvideAuth>
                <ProvideAction>
                  <Switch>
                    <Route exact path="/login">
                      <LoginPage />
                    </Route>

                    <PrivateRoute exact path="/logs" allowNonAuth>
                      <LogsPage />
                    </PrivateRoute>

                    <PrivateRoute exact path="/actions" allowNonAuth>
                      <ActionPage />
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

                    <PrivateRoute path="/explorer">
                      <ExplorerPage />
                    </PrivateRoute>

                    {/* 404 fallback page */}
                    <Route path="/*">
                      <NotFoundPage />
                    </Route>
                  </Switch>
                </ProvideAction>
              </ProvideAuth>
            </ProvideBlade>
          </ProvideSocket>
        </ProvideGraphQLClient>
      </SnackbarProvider>
    </Router>
  );
};

export default App;
