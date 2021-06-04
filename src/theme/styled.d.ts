import "styled-components";
// 참고: https://flowkater.io/frontend/setup-styled-components/
declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      primary: string;
      secondary: string;
      border: string;
      link: string;
      button: string;
      error?: string;
      warning?: string;
      info?: string;
      success?: string;
      like?: string;
    };
    background: {
      primary: string;
      secondary: string;
      avatar: string;
      button: string;
    };
  }
}