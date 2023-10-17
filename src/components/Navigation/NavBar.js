import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import BuildIcon from "@mui/icons-material/Build";
import SideBar from "./SideBar";
import Tooltip from "@mui/material/Tooltip";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SidebarOpen from "./SidebarOpen";

export default function NavBar(props) {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  function changeTheme() {
    if (props.theme === "light") {
      props.setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      props.setTheme("light");
      localStorage.setItem("theme", "light");
    }
  }

  const icon = props.theme === "light" ? <DarkModeIcon /> : <LightModeIcon />;

  return (
    <NavWrap>
      <Navbar show={show}>
        <Left>
          <Tooltip title="Expand Menu" arrow>
            <SidebarOpen onOpenSidebar={props.onOpenSidebar} />
          </Tooltip>
          <Tooltip title="Homepage" arrow>
            <Logo
              src="https://www.pngmart.com/files/23/Marvel-Studios-Logo-PNG-Isolated-HD.png"
              alt="logo"
            />
          </Tooltip>
        </Left>
        <SearchInput>
          <SearchIcon for="search">
            <i className="fas fa-search"></i>
          </SearchIcon>
          <SearchBox id="search" type="text" />
        </SearchInput>
        <Right>
          <Toggle onClick={changeTheme}>{icon}</Toggle>
          <Settings title="Settings" arrow>
            <BuildIcon />
          </Settings>
          <Tooltip title="My Space" arrow>
            <Profile
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg"
              alt="profile"
            />
          </Tooltip>
        </Right>
      </Navbar>
    </NavWrap>
  );
}

const slideUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
  }
`;

const NavWrap = styled.div`
  padding: 10px;
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.navBackground};
  padding: 10px;
  border-radius: 10px;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, opacity 0.3s ease;

  ${(props) =>
    props.hide &&
    css`
      transform: translateY(-100%);
      opacity: 0;
    `}
  ${(props) =>
    props.show === "hide" &&
    css`
      animation: ${slideUp} 0.3s ease forwards;
    `}
  ${(props) =>
    props.show === "show" &&
    css`
      animation: ${slideDown} 0.3s ease forwards;
    `}
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 70px;
  margin-right: 20px;
  cursor: pointer;
`;

const SearchInput = styled.form`
  display: flex;
  align-items: center;
  border-radius: 40px;
  padding: 8px;
  background-color: ${(props) => props.theme.inputBackground};
  color: #f0eee2;
  margin-right: 10px;

  &:focus-within {
    background-color: #f0eee2;
    color: #000;
  }
`;

const SearchIcon = styled.label`
  margin-left: 10px;
  margin-right: 8px;

  i:hover {
    transform: scale(1);
    box-shadow: none;
  }
`;

const SearchBox = styled.input`
  border: none;
  width: 450px;
  background-color: transparent;
  color: #f0eee2;

  &:focus-within {
    color: #000;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Settings = styled(Tooltip)`
  margin: 10px;
  color: ${(props) => props.theme.navBackground};
  stroke: #c0c0c0;
  stroke-width: 1.5;
  cursor: pointer;

  &:hover {
    stroke: #fff;
  }
`;

const Profile = styled.img`
  padding: 5px;
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
`;

const Toggle = styled.button`
  cursor: pointer;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => props.theme.titleColor};
  color: ${(props) => props.theme.pageBackground};
  transition: all 0.5s ease;
  font-size: 10px;

  &:focus {
    outline: none;
  }
`;
