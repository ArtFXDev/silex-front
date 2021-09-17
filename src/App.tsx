import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage";
import Header from "./components/Header/Header";
import LoginPage from "./components/LoginPage/LoginPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { ProvideAuth } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <ProvideAuth>
      <Router>
        <Header />

        <Switch>
          <PrivateRoute exact path="/">
            <HomePage />
          </PrivateRoute>

          <PrivateRoute path="/login" isLoginPage>
            <LoginPage />
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
};

export default App;
