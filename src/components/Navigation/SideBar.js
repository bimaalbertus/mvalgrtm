import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import List from "@mui/material/List";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import TvIcon from "@mui/icons-material/Tv";
import TheatersIcon from "@mui/icons-material/Theaters";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const menuItem = [
  {
    path: "/",
    name: "Home",
    icon: <HomeIcon />,
  },
  {
    path: "/explore/movies",
    name: "Movies",
    icon: <TheatersIcon />,
  },
  {
    path: "/explore/tv-show",
    name: "TV Show",
    icon: <TvIcon />,
  },
  {
    path: "/explore/music",
    name: "Music",
    icon: <LibraryMusicIcon />,
  },
];

function Sidebar({ open, onClose }) {
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

  return (
    <SidebarContainer show={show}>
      <List>
        {menuItem.map((item, index) => (
          <MenuWrap to={item.path} key={index} activeClassName="active">
            <Icon>{item.icon}</Icon>
            <MenuName
              style={{ display: open ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </MenuName>
          </MenuWrap>
        ))}
      </List>
    </SidebarContainer>
  );
}

const slideUp = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
  }
`;

const SidebarContainer = styled.div`
  margin: 120px 20px 20px 10px;
  position: fixed;
  border-radius: 10px;
  background-color: ${(props) => props.theme.sidebarBackground};
  z-index: 999;
  backdrop-filter: blur(8px);

  ${(props) =>
    props.hide &&
    css`
      transform: translateX(-100%);
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

const MenuWrap = styled(NavLink)`
  display: flex;
  color: #c0c0c0;

  &:hover {
    background-color: ${(props) => props.theme.sidebarBackground};
  }

  &.active {
    border-left: 3px solid ${(props) => props.theme.activeColor};
    color: ${(props) => props.theme.activeColor};
  }
`;

const Icon = styled.div`
  margin: 10px;

  svg {
    font-size: 30px;
  }
`;

const MenuName = styled.span`
  margin: 15px;
  width: 100px;
`;

export default Sidebar;
