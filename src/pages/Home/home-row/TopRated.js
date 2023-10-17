import React, { useState } from "react";
import Carousel from "../../../components/carousel-card/Carousel";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import styled from "styled-components";
import useFetch from "../../../hooks/useFetch";

const TopRated = () => {
  const [endpoint, setEndpoint] = useState("movie");

  const { data, loading } = useFetch(`/${endpoint}/top_rated`);

  const onTabChange = (tab) => {
    setEndpoint(tab === "Movies" ? "movie" : "tv");
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <SwitchTabs data={["Movies", "TV Shows"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel
        data={data?.results}
        loading={loading}
        endpoint={endpoint}
        title="Top Rated"
      />
    </div>
  );
};

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;
`;

export default TopRated;
