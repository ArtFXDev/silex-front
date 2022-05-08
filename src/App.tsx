import ActionsPage from "components/pages/ActionPage/ActionsPage";
import ArcadePage from "components/pages/ArcadePage/ArcadePage";
import DCCClientsPage from "components/pages/DCCClientsPage/DCCClientsPage";
import ExplorerPage from "components/pages/ExplorerPage/ExplorerPage";
import HarvestPage from "components/pages/HarvestPage/HarvestPage";
import HomePage from "components/pages/HomePage/HomePage";
import LoginPage from "components/pages/LoginPage/LoginPage";
import LogsPage from "components/pages/LogsPage/LogsPage";
import NotFoundPage from "components/pages/NotFoundPage/NotFoundPage";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";
import RunningJobsPage from "components/pages/RunningJobsPage/RunningJobsPage";
import SettingsPage from "components/pages/SettingsPage/SettingsPage";
import SilexCoinPage from "components/pages/SilexCoinPage/SilexCoinPage";
import StatsPage from "components/pages/StatsPage/StatsPage";
import TicketPage from "components/pages/TicketPage/TicketPage";
import TractorPage from "components/pages/TractorPage/TractorPage";
import PrivateRoute from "components/utils/PrivateRoute/PrivateRoute";
import {
  ProvideAction,
  ProvideAuth,
  ProvideGraphQLClient,
  ProvideSocket,
} from "context";
import { ProvideAnimation } from "context/AnimationContext";
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
        <ProvideAnimation>
          <ProvideGraphQLClient>
            <ProvideAuth>
              <ProvideSocket>
                <ProvideAction>
                  <ProvideBlade>
                    <Switch>
                      <Route exact path="/login">
                        <LoginPage />
                      </Route>

                      <PrivateRoute exact path="/logs" allowNonAuth>
                        <LogsPage />
                      </PrivateRoute>

                      <PrivateRoute path="/action/:uuid?" allowNonAuth>
                        <ActionsPage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/running-jobs" allowNonAuth>
                        <RunningJobsPage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/stats" allowNonAuth>
                        <StatsPage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/">
                        <HomePage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/profile">
                        <ProfilePage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/coins">
                        <SilexCoinPage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/dccs">
                        <DCCClientsPage />
                      </PrivateRoute>

                      <PrivateRoute path="/explorer">
                        <ExplorerPage />
                      </PrivateRoute>

                      <PrivateRoute path="/arcade">
                        <ArcadePage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/tractor">
                        <TractorPage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/harvest">
                        <HarvestPage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/ticket">
                        <TicketPage />
                      </PrivateRoute>

                      <PrivateRoute exact path="/settings">
                        <SettingsPage />
                      </PrivateRoute>

                      {/* 404 fallback page */}
                      <Route path="/*">
                        <NotFoundPage />
                      </Route>
                    </Switch>
                  </ProvideBlade>
                </ProvideAction>
              </ProvideSocket>
            </ProvideAuth>
          </ProvideGraphQLClient>
        </ProvideAnimation>
      </SnackbarProvider>
    </Router>
  );
};

export default App;
