import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: "LuckiestGuy";
        font-style: normal;
        font-weight: normal;
        src: url('/fonts/LuckiestGuy-Regular.ttf') format("truetype");
    }
    @font-face {
        font-family: "DoHyun";
        font-style: normal;
        font-weight: normal;
        src: url('/fonts/DoHyeon-Regular.ttf') format("truetype"),
             url('/fonts/DoHyeon-Regular.woff') format("woff");
    }
    
    ${reset}
    a{
        text-decoration: none;
        color: inherit;
    }
    *, html, body {
        box-sizing: border-box;        
        font-family: 'DoHyun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 14px;        
    }
    button {
        background-color: inherit;
        color: inherit;
        border: none;
        outline: none;
        cursor: pointer;
    }
`;
