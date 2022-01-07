import ActionPage from "components/pages/ActionPage/ActionPage";
import DCCClientsPage from "components/pages/DCCClientsPage/DCCClientsPage";
import ExplorerPage from "components/pages/ExplorerPage/ExplorerPage";
import HomePage from "components/pages/HomePage/HomePage";
import LoginPage from "components/pages/LoginPage/LoginPage";
import LogsPage from "components/pages/LogsPage/LogsPage";
import NotFoundPage from "components/pages/NotFoundPage/NotFoundPage";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";
import RunningJobsPage from "components/pages/RunningJobsPage/RunningJobsPage";
import TicketPage from "components/pages/TicketPage/TicketPage";
import TractorPage from "components/pages/TractorPage/TractorPage";
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
            <ProvideAction>
              <ProvideBlade>
                <ProvideAuth>
                  <Switch>
                    <Route exact path="/login">
                      <LoginPage />
                    </Route>

                    <PrivateRoute exact path="/logs" allowNonAuth>
                      <LogsPage />
                    </PrivateRoute>

                    <PrivateRoute path="/action/:uuid?" allowNonAuth>
                      <ActionPage />
                    </PrivateRoute>

                    <PrivateRoute exact path="/running-jobs" allowNonAuth>
                      <RunningJobsPage />
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

                    <PrivateRoute exact path="/tractor">
                      <TractorPage />
                    </PrivateRoute>

                    <PrivateRoute exact path="/ticket">
                      <TicketPage />
                    </PrivateRoute>

                    {/* 404 fallback page */}
                    <Route path="/*">
                      <NotFoundPage />
                    </Route>
                  </Switch>
                </ProvideAuth>
              </ProvideBlade>
            </ProvideAction>
          </ProvideSocket>
        </ProvideGraphQLClient>
      </SnackbarProvider>
    </Router>
  );
};

export default App;
