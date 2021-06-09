import { gql } from "@apollo/client";
import { ALL_SHOP } from "./fragments";

export const MUTATION_CREATE_ACCOUNT = gql`
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

export const MUTATION_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      error
      token
    }
  }
`;

export const MUTATION_CREATE_SHOP = gql`
  mutation CreateShop(
    $name: String!
    $categories: [String]!
    $address: String!
    $lat: Float!
    $lng: Float!
    $photos: [Upload]
  ) {
    createCoffeeShop(
      name: $name
      categories: $categories
      address: $address
      lat: $lat
      lng: $lng
      photos: $photos
    ) {
      ok
      error
    }
  }
`;

export const QUERY_SHOPS = gql`
  query AllShops($lastId: Int) {
    seeCoffeeShops(lastId: $lastId) {
      ...AllShop
    }
  }
  ${ALL_SHOP}
`;

export const QUERY_SEE_CAFE = gql`
  query SeeCafe($id: Int!) {
    seeCoffeeShop(id: $id) {
      ...AllShop
    }
  }
  ${ALL_SHOP}
`;

export const MUTATION_DELETE_SHOP = gql`
  mutation DeleteShop($id: Int!) {
    deleteCoffeeShop(id: $id) {
      ok
      error
    }
  }
`;
