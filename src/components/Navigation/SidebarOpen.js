import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import styled from "styled-components";

const SidebarOpen = ({ onOpenSidebar }) => {
  return (
    <div>
      <MenuBars onClick={onOpenSidebar} />
    </div>
  );
};

const MenuBars = styled(MenuIcon)`
  color: #c0c0c0;
  margin-right: 30px;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

export default SidebarOpen;
