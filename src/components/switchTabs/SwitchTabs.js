import React, { useState } from "react";
import { styled } from "styled-components";

const SwitchTabs = ({ data, onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [left, setLeft] = useState(0);

  const activeTab = (tab, index) => {
    setLeft(index * 100);
    setTimeout(() => {
      setSelectedTab(index);
    }, 300);
    onTabChange(tab, index);
  };

  return (
    <SwitchingTabs>
      <TabItems>
        {data.map((tab, index) => (
          <span
            key={index}
            className={`tabItem ${selectedTab === index ? "active" : ""}`}
            onClick={() => activeTab(tab, index)}
          >
            {tab}
          </span>
        ))}
        <MovingBg style={{ left }} />
      </TabItems>
    </SwitchingTabs>
  );
};

const SwitchingTabs = styled.div`
  width: 210px;
  background-color: ${(props) => props.theme.navBackground};
  border-radius: 20px;
  padding: 15px 10px 15px 10px;
  margin: 20px 0 20px auto;
`;

const TabItems = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  .tabItem {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: ${(props) => props.theme.additionalColor};
    font-size: 14px;
    position: relative;
    z-index: 1;
    cursor: pointer;
    transition: color ease 0.3s;
  }

  .tabItem.active {
    color: ${(props) => props.theme.textColor};
  }
`;

const MovingBg = styled.span`
  height: 30px;
  width: 90px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.inputBackground};
  position: absolute;
  left: 0;
  transition: left cubic-bezier(0.88, -0.35, 0.565, 1.35) 0.4s;
`;

export default SwitchTabs;
