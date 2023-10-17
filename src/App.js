import React, { useState, useEffect } from "react";
import NavBar from "./components/Navigation/NavBar";
import SideBar from "./components/Navigation/SideBar";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./GlobalStyle";
import Router from "./container/Router";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

const LightTheme = {
  pageBackground: "#F3FDE8",
  navBackground: "rgb(164,144,124,0.8)",
  sidebarBackground: "rgba(0,0,0,0.5)",
  inputBackground: "#c0c0c0",
  titleColor: "rgba(0,0,0,0.5)",
  textColor: "#000",
  activeColor: "#FFBFBF",
  additionalColor: "#fff",
  spanColor: "#242424",
  overlayColor: "rgba(0, 0, 0, 0.2)",
};

const DarkTheme = {
  pageBackground: "#1f1f1f",
  navBackground: "rgba(67,71,80,0.5)",
  sidebarBackground: "rgba(200,200,200,0.1)",
  inputBackground: "#565656",
  titleColor: "#EBAE00",
  textColor: "#fff",
  activeColor: "#F3B125",
  additionalColor: "#c0c0c0",
  spanColor: "#c0c0c0",
  overlayColor: "rgba(0,0,0,0.5)",
};

const themes = {
  light: LightTheme,
  dark: DarkTheme,
};

const App = () => {
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  console.clear();

  return (
    <BrowserRouter>
      <ThemeProvider theme={themes[theme]}>
        <GlobalStyle />
        <NavbarWrapper>
          <NavBar
            theme={theme}
            setTheme={setTheme}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onOpenSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </NavbarWrapper>
        <SideBarWrapper theme={theme}>
          <SideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </SideBarWrapper>
        <ContentWrapper sidebarOpen={sidebarOpen}>
          <Router />
        </ContentWrapper>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const NavbarWrapper = styled.div`
  position: fixed;
  height: 120px;
  width: 100%;
  z-index: 999;
`;

const SideBarWrapper = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  margin-left: ${(props) => (props.sidebarOpen ? "200px" : "70px")};
  padding-top: 120px;
`;

export default App;
