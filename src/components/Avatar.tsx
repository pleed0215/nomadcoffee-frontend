import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { getMouseVertical } from "../utils";

enum AvatarSize {
  xs = "0.75em",
  sm = "1.5em",
  lg = "1.8em",
  "2x" = "2em",
  "3x" = "3em",
  "4x" = "4em",
  "5x" = "5em",
  "6x" = "6em",
  "7x" = "7em",
  "8x" = "8em",
  "9x" = "9em",
  "10x" = "10em",
}

type AvatarSizeType = keyof typeof AvatarSize;

interface AvatarProps {
  url: string | null | undefined;
  size: AvatarSizeType;
  outline?: boolean;
  linkable?: boolean;
}

const AvatarContainer = styled.div<AvatarProps>`
  width: ${(props) => AvatarSize[props.size]};
  height: ${(props) => AvatarSize[props.size]};
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 50%;
  background-color: ${(props) => props.theme.background.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  ${(props) =>
    props.outline &&
    css`
      border: 1px solid ${(props) => props.theme.color.primary};
    `};
  ${(props) =>
    props.url &&
    css`
      background-image: url(${props.url});
    `};
`;

export const Avatar: React.FC<AvatarProps> = ({
  url,
  size,
  outline = false,
}) => {
  return (
    <AvatarContainer
      size={size}
      url={url}
      onMouseEnter={getMouseVertical}
      outline={outline}
    >
      {!url && <FontAwesomeIcon icon={faUser} size={size} color="gray" />}
    </AvatarContainer>
  );
};

interface AvatarAndUsernameProp extends AvatarProps {
  username: string;
  email?: string;
  textColor: string;
}
const PhotoItemHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  padding: 10px;
`;

const PhotoItemHeaderUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

const PhotoItemHeaderUsername = styled.span`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 3px;
  color: ${(props) => props.color};
`;

const PhotoItemHeaderName = styled.span`
  font-size: 14px;
  color: ${(props) => props.color};
`;

export const AvatarAndUsername: React.FC<AvatarAndUsernameProp> = ({
  url,
  username,
  email,
  linkable,
  textColor,
}) => {
  return linkable ? (
    <PhotoItemHeader>
      <Link
        to={`/users/${username}`}
        style={{ display: "flex", color: "inherit" }}
      >
        <Avatar url={url} size="lg" />
        <PhotoItemHeaderUserInfo>
          <PhotoItemHeaderUsername color={textColor}>
            {username}
          </PhotoItemHeaderUsername>
          <PhotoItemHeaderName color={textColor}>{email}</PhotoItemHeaderName>
        </PhotoItemHeaderUserInfo>
      </Link>
    </PhotoItemHeader>
  ) : (
    <PhotoItemHeader>
      <Avatar url={url} size="lg" />
      <PhotoItemHeaderUserInfo>
        <PhotoItemHeaderUsername color={textColor}>
          {username}
        </PhotoItemHeaderUsername>
        <PhotoItemHeaderName color={textColor}>{email}</PhotoItemHeaderName>
      </PhotoItemHeaderUserInfo>
    </PhotoItemHeader>
  );
};
