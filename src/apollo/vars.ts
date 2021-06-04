import { makeVar } from "@apollo/client";
import { AUTH_TOKEN_NAME, DARK_NAME } from "../constants";
import { apolloClient } from "./client";

export const getTokenFromLS = () => localStorage.getItem(AUTH_TOKEN_NAME);
export const setTokenToLS = (token: string) =>
  localStorage.setItem(AUTH_TOKEN_NAME, token);
export const removeTokenFromLS = () => localStorage.removeItem(AUTH_TOKEN_NAME);
export const isLoggedInVar = makeVar(Boolean(getTokenFromLS()));
export const authTokenVar = makeVar(getTokenFromLS());
export const makeLogin = (token: string) => {
  setTokenToLS(token);
  isLoggedInVar(true);
  authTokenVar(token);
};
export const makeLogout = async () => {
  removeTokenFromLS();
  isLoggedInVar(false);
  authTokenVar(null);
  await apolloClient.clearStore();
};

const isDarkFromLS = () => localStorage.getItem(DARK_NAME) || "false";
const setDarkModelToLS = (isDark: boolean) =>
  localStorage.setItem(DARK_NAME, isDark.toString());

export const darkModeVar = makeVar(isDarkFromLS() === "true");
export const setDarkMode = (isDark: boolean) => {
  setDarkModelToLS(isDark);
  darkModeVar(isDark);
};