import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import React, { useRef, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ALL_SHOP, ALL_USER } from "../../apollo/fragments";
import { authTokenVar } from "../../apollo/vars";
import { MyShops, MyShopsVariables } from "../../codegen/MyShops";
import { SeeUser, SeeUserVariables } from "../../codegen/SeeUser";
import {
  UpdateAvatar,
  UpdateAvatarVariables,
} from "../../codegen/UpdateAvatar";
import { Avatar } from "../../components/Avatar";
import { CafeItem } from "../../components/CafeItem";

import { HelmetOnlyTitle } from "../../components/HelmetOnlyTitle";
import { LayoutContainer } from "../../components/LayoutContainer";
import { PageLoader } from "../../components/Loader";
import { ToggleFollows } from "../../components/ToggleFollow";
import { useMe } from "../../hooks/useMe";
import { device } from "../../theme/theme";

const QUERY_USER = gql`
  query SeeUser($id: Int!) {
    seeUser(id: $id) {
      ...AllUser
    }
  }
  ${ALL_USER}
`;

const QUERY_SHOPS = gql`
  query MyShops($id: Int!) {
    searchShopsByUserId(id: $id) {
      ...AllShop
    }
  }
  ${ALL_SHOP}
`;

const MUTATION_UPDATE_AVATAR = gql`
  mutation UpdateAvatar($file: Upload!) {
    updateAvatar(file: $file) {
      ok
      error
      url
    }
  }
`;

const Container = styled(LayoutContainer)`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  width: 100%;
  position: relative;
  ${device.xs} {
    flex-direction: column;
    align-items: center;
  }
`;

const AvatarContainer = styled.button`
  margin-left: 5rem;
  margin-right: 5rem;
  position: relative;
  min-width: 152px;
  max-width: 152px;
`;

const UserContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
  ${device.xs} {
    margin-top: 8px;
    align-items: center;
  }
`;

const UsernameContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SpanUsername = styled.span`
  font-size: 26px;
  margin-right: 1rem;
  vertical-align: text-bottom;
`;

const ButtonEditProfile = styled(Link)`
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 5px;
  min-width: 100px;
  height: 32px;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NumberContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SpanNumber = styled.span`
  &:not(:last-child) {
    margin-right: 2rem;
  }
`;

const SpanName = styled.span``;

const AvatarMenu = styled.button`
  background-color: rgb(230, 230, 230);
  color: blue;
  text-align: center;
  position: absolute;
  bottom: -45px;
  width: 200px;
  left: 100px;
  padding: 10px;
  border-radius: 8px;
  &:before {
    content: "";
    height: 5px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid rgb(230, 230, 230);
    border-top: 5px solid none;
    position: absolute;
    top: -10px;
    left: 40px;
  }
`;

export const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const [seeMenu, setSeeMenu] = useState(false);
  const avatarMenu = useRef<HTMLButtonElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const isLoggedIn = useReactiveVar(authTokenVar);

  const { data: me, loading: meLoading } = useMe();
  const { data, loading } = useQuery<SeeUser, SeeUserVariables>(QUERY_USER, {
    variables: {
      id: +id,
    },
  });
  const { data: shops, loading: shopsLoading } = useQuery<
    MyShops,
    MyShopsVariables
  >(QUERY_SHOPS, { variables: { id: +id } });
  const [updateAvatar] = useMutation<UpdateAvatar, UpdateAvatarVariables>(
    MUTATION_UPDATE_AVATAR
  );

  const onAvatarMenuClick = () => {
    setSeeMenu(!seeMenu);
  };
  const onBlurAvatar = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (e.relatedTarget !== avatarMenu.current) {
      setSeeMenu(false);
    }
  };
  const onAvatarChangeClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (fileInput.current) fileInput.current.click();
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (me && files && files.length > 0) {
      const file = files[0];

      updateAvatar({
        variables: {
          file,
        },
        update: (cache, result) => {
          if (result.data?.updateAvatar.ok) {
            cache.modify({
              id: `User:${id}`,
              fields: {
                avatarURL: () => result.data?.updateAvatar.url,
              },
            });
          }
        },
      });
    }
    setSeeMenu(false);
  };

  if (loading || meLoading || shopsLoading) {
    return <PageLoader />;
  } else {
    const user = data?.seeUser!;
    const mySelf = me?.me!;
    const myShops = shops?.searchShopsByUserId;

    return (
      <>
        {(loading || meLoading || shopsLoading) && <PageLoader />}
        {data && shops && (
          <Container>
            <HelmetOnlyTitle title={`${user.username}'s page`} />
            <ProfileContainer>
              <AvatarContainer
                onClick={onAvatarMenuClick}
                onBlur={onBlurAvatar}
              >
                <Avatar size="10x" url={user?.avatarURL} />
              </AvatarContainer>
              {seeMenu && user.isMe && (
                <AvatarMenu ref={avatarMenu} onClick={onAvatarChangeClick}>
                  아바타 변경
                  <input
                    type="file"
                    accept="image/jpeg"
                    ref={fileInput}
                    style={{ display: "none" }}
                    onChange={onFileSelect}
                  />
                </AvatarMenu>
              )}
              <UserContentContainer>
                <UsernameContainer>
                  <SpanUsername>{user?.username}</SpanUsername>
                  {user.isMe && (
                    <ButtonEditProfile to="/edit-me">
                      프로필 편집
                    </ButtonEditProfile>
                  )}
                  {!user.isMe && isLoggedIn && (
                    <div style={{ minWidth: 100 }}>
                      <ToggleFollows
                        isFollowing={user.isFollowing!}
                        authId={mySelf.id}
                        userId={user.id}
                      />
                    </div>
                  )}
                </UsernameContainer>
                <NumberContainer>
                  <SpanNumber>팔로워 {user?.totalFollowers}</SpanNumber>
                  <SpanNumber>팔로우 {user?.totalFollowings}</SpanNumber>
                </NumberContainer>
                <SpanName>{user.name}</SpanName>
                <SpanName>{user.email}</SpanName>
              </UserContentContainer>
            </ProfileContainer>
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <h4 style={{ fontSize: "1.5rem" }}>보유 카페</h4>
            </div>
            {myShops &&
              myShops.length > 0 &&
              myShops.map(
                (shop) =>
                  shop && (
                    <CafeItem key={`CoffeeShop:${shop?.id}`} shop={shop} />
                  )
              )}
          </Container>
        )}
      </>
    );
  }
};
