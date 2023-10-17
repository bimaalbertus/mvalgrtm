import React from "react";
import styled, { keyframes } from "styled-components";

const Spinner = ({ initial }) => {
  return (
    <StyledLoadingSpinner initial={initial}>
      <StyledSpinner viewBox="0 0 50 50">
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        ></circle>
      </StyledSpinner>
    </StyledLoadingSpinner>
  );
};

const rotateAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const dashAnimation = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const StyledLoadingSpinner = styled.div`
  width: 100%;
  height: ${({ initial }) => (initial ? "700px" : "150px")};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSpinner = styled.svg`
  animation: ${rotateAnimation} 2s linear infinite;
  z-index: 2;
  width: 50px;
  height: 50px;

  .path {
    stroke: hsl(210, 70%, 75%);
    stroke-linecap: round;
    animation: ${dashAnimation} 1.5s ease-in-out infinite;
  }
`;

export default Spinner;
