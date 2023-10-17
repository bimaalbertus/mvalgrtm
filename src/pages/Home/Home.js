import React from "react";
import Popular from "./home-row/Popular";
import Trending from "./home-row/Trending";
import styled from "styled-components";
import BannerAd from "../../components/adBanner/SideAd";
import TopRated from "./home-row/TopRated";

const Home = () => {
  return (
    <ContainerRow>
      <Trending />
      <Popular />
      <TopRated />
    </ContainerRow>
  );
};

const ContainerRow = styled.main`
  position: relative;
  overflow: hidden;
  display: block;
  padding: 0 calc(3.5vw + 5px);
`;

export default Home;
