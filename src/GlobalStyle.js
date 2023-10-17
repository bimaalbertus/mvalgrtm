import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.pageBackground};
    color: ${(props) => props.theme.textColor};
  }
`;

export default GlobalStyle;
