import React, { useState } from "react";
import Carousel from "../../../components/carousel-card/Carousel";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import styled from "styled-components";
import useFetch from "../../../hooks/useFetch";

const Trending = () => {
  const [endpoint, setEndpoint] = useState("day");
  const { data, loading } = useFetch(`/trending/movie/${endpoint}`);

  const onTabChange = (tab) => {
    setEndpoint(tab === "Day" ? "day" : "week");
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <SwitchTabs data={["Day", "Week"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel
        data={data?.results}
        loading={loading}
        endpoint={endpoint}
        title="Trending"
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

export default Trending;
