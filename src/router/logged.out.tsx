import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotFoundPage } from "../pages/404";
import { HomePage } from "../pages/logged.in/home";
import { AuthPage } from "../pages/logged.out/auth";
import { Header } from "../components/Header";
import { SearchPage } from "../pages/logged.in/search";
import { SeeCafePage } from "../pages/logged.in/shop";
import styled from "styled-components";
import { UserPage } from "../pages/logged.in/user";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 6rem;
  margin-bottom: 3rem;
`;

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
        <Route path="/home" exact>
          <Header />
          <Container>
            <HomePage />
          </Container>
        </Route>
        <Route path="/search">
          <Header />
          <Container>
            <SearchPage />
          </Container>
        </Route>
        <Route path="/shop/:id">
          <Header />
          <Container>
            <SeeCafePage />
          </Container>
        </Route>
        <Route path="/users/:id">
          <Header />
          <Container>
            <UserPage />
          </Container>
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
};
