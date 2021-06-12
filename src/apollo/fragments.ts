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

export const PART_SHOP = gql`
  fragment PartShop on CoffeeShop {
    id
    name
    firstPhotoUrl
    isMine
  }
`;

export const PART_USER = gql`
  fragment PartUser on User {
    id
    username
    email
    name
    avatarURL
    location
    githubUsername
  }
`;

export const ALL_USER = gql`
  fragment AllUser on User {
    id
    username
    email
    name
    avatarURL
    githubUsername
    totalFollowers
    totalFollowings
    isFollowed
    isFollowing
    isMe
    location
  }
`;

export const ALL_CATEGORY = gql`
  fragment AllCategory on Category {
    id
    name
    slug
    totalShops
    shops {
      ...AllShop
    }
  }
  ${ALL_SHOP}
`;
