import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotFoundPage } from "../pages/404";
import { AuthPage } from "../pages/logged.out/auth";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <AuthPage isCreating />
        </Route>
        <Route path="/signin" exact>
          <AuthPage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
};
