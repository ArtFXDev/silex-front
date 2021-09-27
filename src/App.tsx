import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Header from "components/Header/Header";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import { ProvideAuth, ProvideSocket } from "context";

// Pages
import HomePage from "components/pages/HomePage/HomePage";
import LoginPage from "components/pages/LoginPage/LoginPage";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";
import ExplorerPage from "components/pages/ExplorerPage/ExplorerPage";
import DCCClientsPage from "components/pages/DCCClientsPage/DCCClientsPage";

const App: React.FC = (props) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <ProvideSocket>
        <ProvideAuth>
          <Router>
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
              </>
            </Switch>
          </Router>
        </ProvideAuth>
      </ProvideSocket>
    </SnackbarProvider>
  );
};

export default App;
