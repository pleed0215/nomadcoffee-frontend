import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo/vars";
import { SeeMe } from "../codegen/SeeMe";

export const QUERY_ME = gql`
  query SeeMe {
    me {
      id
      username
      email
      name
      avatarURL
      location
      githubUsername
    }
  }
`;

export const useMe = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return useQuery<SeeMe>(QUERY_ME, {
    skip: !isLoggedIn,
    fetchPolicy: "cache-and-network",
  });
};