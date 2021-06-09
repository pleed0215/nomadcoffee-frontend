import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import { Header } from "../components/Header";
import { NotFoundPage } from "../pages/404";
import { AddOrEditPage } from "../pages/logged.in/add";
import { HomePage } from "../pages/logged.in/home";
import { SeeCafePage } from "../pages/logged.in/shop";

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

export const LoggedInRouter = () => {
  return (
    <Router>
      <Header />
      <Container>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/add" exact>
            <AddOrEditPage />
          </Route>
          <Route path="/shop/:id" exact>
            <SeeCafePage />
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};
