import { ApolloProvider, useReactiveVar } from "@apollo/client";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { apolloClient } from "./apollo/client";
import styled, { ThemeProvider } from "styled-components";
import { darkModeVar, isLoggedInVar } from "./apollo/vars";
import { darkTheme, lightTheme } from "./theme/theme";
import { GlobalStyles } from "./components/GlobalStyles";
import { LoggedInRouter } from "./router/logged.in";
import { LoggedOutRouter } from "./router/logged.out";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.color.primary};
  transition: background-color 0.4s;
`;

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDarkMode = useReactiveVar(darkModeVar);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <HelmetProvider>
          <Helmet></Helmet>
          <GlobalStyles />
          <Container>
            {isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />}
          </Container>
        </HelmetProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
