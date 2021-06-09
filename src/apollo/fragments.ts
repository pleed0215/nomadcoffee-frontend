import { gql } from "@apollo/client";

export const ALL_SHOP = gql`
  fragment AllShop on CoffeeShop {
    id
    name
    lat
    lng
    address
    firstPhotoUrl
    isMine
    user {
      id
      username
      email
      avatarURL
    }
    categories {
      id
      slug
    }
    photos {
      id
      url
    }

    createdAt
    updatedAt
  }
`;
