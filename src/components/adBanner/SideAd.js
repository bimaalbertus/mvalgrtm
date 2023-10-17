import React from "react";
import styled from "styled-components";

export default function BannerAd({ side }) {
  return (
    <BannerContainer side={side}>
      <BannerImage
        src="https://cdn-web-2.ruangguru.com/roboguru-ui/public/assets/images/landing_benefit_screen_1.png?width=347&convert=webp"
        alt="Banner Ad"
      />
    </BannerContainer>
  );
}

const BannerContainer = styled.div`
  position: absolute;
  top: 20%;
  ${(props) => (props.side === "left" ? "left: 0;" : "right: 0;")}
  transform: translateY(-20%);
`;

const BannerImage = styled.img`
  width: 200px;
  height: auto;
`;
