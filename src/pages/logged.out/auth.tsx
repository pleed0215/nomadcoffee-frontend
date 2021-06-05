import gql from "graphql-tag";
import React from "react";

import styled, { keyframes } from "styled-components";
import { ReactComponent as CoffeeBean } from "../../assets/bean.svg";

const MUTATION_CREATE_ACCOUNT = gql`
  mutation CreateAccount(
    $username: String!
    $email: String!
    $name: String
    $password: String!
    $location: String
    $githubUsername: String
  ) {
    createAccount(
      username: $username
      email: $email
      name: $name
      password: $password
      location: $location
      githubUsername: $githubUsername
    ) {
      ok
      error
    }
  }
`;

const MUTATION_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      error
      token
    }
  }
`;

type AuthPageProps = {
  isCreating: boolean;
};

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url("/intro.jpg");

  display: flex;
  justify-content: center;
`;

const topToBototm = keyframes`
    from {
        color: rgba(255, 255, 255, 0.2);
        transform: translateY(-270px);
    }
    to {
        color: rgba(255, 255, 255, 0.9);
        transform: translateY(0px);
    }
`;

const Title = styled.h1`
  margin-top: 300px;
  font-family: LuckiestGuy;
  font-size: 4rem;
  color: white;
  letter-spacing: 0.4rem;
  animation: ${topToBototm} 0.4s linear;
`;

export const AuthPage: React.FC<AuthPageProps> = () => {
  return (
    <Container>
      <Title>
        <CoffeeBean
          width="40"
          height="40"
          fill="#ffffff"
          style={{ marginRight: 10 }}
        />
        Nomad Coffee
        <CoffeeBean
          width="40"
          height="40"
          fill="#ffffff"
          style={{ marginLeft: 10 }}
        />
      </Title>
    </Container>
  );
};
