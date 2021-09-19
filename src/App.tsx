import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import Header from "components/Header/Header";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import { ProvideAuth } from "context/AuthContext";

// Pages
import HomePage from "components/pages/HomePage/HomePage";
import LoginPage from "components/pages/LoginPage/LoginPage";
import ProfilePage from "components/pages/ProfilePage/ProfilePage";

const App: React.FC = (props) => {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <PrivateRoute exact path="/login" isLoginPage>
            <LoginPage />
          </PrivateRoute>

          <>
            <Header />

            <PrivateRoute exact path="/">
              <HomePage />
            </PrivateRoute>

            <PrivateRoute exact path="/profile">
              <ProfilePage />
            </PrivateRoute>
          </>
        </Switch>
      </Router>
    </ProvideAuth>
  );
};

export default App;
