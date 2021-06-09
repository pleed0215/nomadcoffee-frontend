import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SLink = styled(Link)`
  color: ${(props) => props.theme.color.link};
  font-weight: 600;
`;

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const timeSince = (date: Date) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export const secondsToTime = (seconds: number) => {
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export const makeLinkText = (text: string) => {
  const randomNumber = Math.floor(Math.random() * 10000);
  return text.split(" ").map((word, index) => {
    if (/#[\w]+/gi.test(word)) {
      return (
        <React.Fragment key={`${randomNumber}_${index}`}>
          <SLink to={`/hashtags/${word.slice(1).toLowerCase()}`}>{word}</SLink>
          &nbsp;
        </React.Fragment>
      );
    } else if (/@[\w]+/gi.test(word)) {
      return (
        <React.Fragment key={`${randomNumber}_${index}`}>
          <SLink
            key={`${randomNumber}_${index}`}
            to={`/users/${word.slice(1)}`}
          >
            {word}
          </SLink>
          &nbsp;
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment key={`${randomNumber}_${index}`}>
          {word}&nbsp;
        </React.Fragment>
      );
    }
  });
};

type MouseVerticalPosition = "Upper" | "Bottom";
export const getMouseVertical = (
  e: React.MouseEvent
): MouseVerticalPosition => {
  return window.innerHeight / 2 > e.screenY ? "Upper" : "Bottom";
};
