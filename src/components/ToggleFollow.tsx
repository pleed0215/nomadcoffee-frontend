import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ToggleFollow, ToggleFollowVariables } from "../codegen/ToggleFollow";

import { ButtonInactivable } from "./ButtonInactivable";

interface ToggleFollowPros {
  isFollowing: boolean;
  authId: number;
  userId: number;
}

export const MUTATION_TOGGLE_FOLLOW = gql`
  mutation ToggleFollow($userId: Int!) {
    toggleFollow(userId: $userId) {
      ok
      error
      message
      followed
    }
  }
`;

export const ToggleFollows: React.FC<ToggleFollowPros> = ({
  isFollowing,
  authId,
  userId,
}) => {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const client = useApolloClient();
  const [toggleFollow] = useMutation<ToggleFollow, ToggleFollowVariables>(
    MUTATION_TOGGLE_FOLLOW,
    {
      onCompleted: (data) => {
        setLoading(false);
        setFollowing((prev) => !prev);
        if (data.toggleFollow.ok) {
          client.cache.modify({
            id: `User:${authId}`,
            fields: {
              totalFollowings(prev) {
                return following ? prev - 1 : prev + 1;
              },
            },
          });
          client.cache.modify({
            id: `User:${userId}`,
            fields: {
              totalFollowers(prev) {
                return following ? prev - 1 : prev + 1;
              },
              isFollowing(prev) {
                return !prev;
              },
            },
          });
        }
      },
    }
  );

  const onClick = () => {
    setLoading(true);
    toggleFollow({
      variables: {
        userId,
      },
    });
  };
  return (
    <ButtonInactivable
      loading={loading}
      isActivate={!loading}
      onClick={onClick}
    >
      {following ? "언팔로우" : "팔로우"}
    </ButtonInactivable>
  );
};
