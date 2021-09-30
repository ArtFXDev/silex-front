import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import Header from "components/Header/Header";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import { ProvideAuth } from "context/AuthContext";

// Pages
import HomePage from "components/pages/HomePage/HomePage";
import LoginPage from "components/pages/LoginPage/LoginPage";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";
import ExplorerPage from "components/pages/ExplorerPage/ExplorerPage";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const App: React.FC = (props) => {
  return (
    <ApolloProvider client={client}>
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
            </>
          </Switch>
        </Router>
      </ProvideAuth>
    </ApolloProvider>
  );
};

export default App;
