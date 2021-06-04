import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";


export const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: "LuckiestGuy";
        font-style: normal;
        font-weight: normal;
        src: url('fonts/LuckiestGuy-Regular.ttf') format("truetype");
    }
    ${reset}
    a{
        text-decoration: none;
        color: inherit;
    }
    html{
        box-sizing: border-box;        
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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