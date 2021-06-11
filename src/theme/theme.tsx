import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  color: {
    primary: "#6f4e37",
    secondary: "#efefef",
    border: "#374b6f",
    link: "#0095f6",
    button: "white",
    like: "#ED4956",
  },
  background: {
    primary: "#fafafa",
    secondary: "#6f4e37",
    button: "#6f4e37",
    avatar: "#dbdbdb",
  },
};
export const darkTheme: DefaultTheme = {
  color: {
    primary: "#eee",
    secondary: "rgb(78,171,205)",
    border: "rgb(219,219,219)",
    link: "#0095f6",
    button: "white",
    like: "#ED4956",
  },
  background: {
    primary: "#333",
    secondary: "#454545",
    button: "#4795f6",
    avatar: "#dbdbdb",
  },
};

// W3School.com 기준 5단계 breakpoint
export const breakpoints = {
  xs: "400px",
  sm: "600px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
};

// https://jsramblings.com/how-to-use-media-queries-with-styled-components/
export const device = {
  xs: `@media screen and (max-width: ${breakpoints.sm})`,
  sm: `@media screen and (min-width: ${breakpoints.sm})`,
  md: `@media screen and (min-width: ${breakpoints.md})`,
  lg: `@media screen and (min-width: ${breakpoints.lg})`,
  xl: `@media screen and (min-width: ${breakpoints.xl})`,
};
