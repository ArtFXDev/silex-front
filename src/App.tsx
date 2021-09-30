import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import Header from "components/Header/Header";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import { ProvideAuth, ProvideSocket } from "context";

// Pages
import HomePage from "components/pages/HomePage/HomePage";
import LoginPage from "components/pages/LoginPage/LoginPage";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";
import ExplorerPage from "components/pages/ExplorerPage/ExplorerPage";
import DCCClientsPage from "components/pages/DCCClientsPage/DCCClientsPage";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
};

export default App;
