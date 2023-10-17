import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styled from "styled-components";

const CircleRating = ({ rating }) => {
  return (
    <StyledCircleRating>
      <CircularProgressbar
        value={rating}
        maxValue={10}
        text={rating}
        styles={buildStyles({
          pathColor: rating < 5 ? "red" : rating < 7 ? "orange" : "green",
        })}
      />
    </StyledCircleRating>
  );
};

const StyledCircleRating = styled.div`
  background-color: #fff;
  border-radius: 50%;
  padding: 2px;
  width: 50px;
  z-index: 2;
  position: relative;
  top: 30px;

  .CircularProgressbar-text {
    font-size: 34px;
    font-weight: 700;
    fill: #000;
  }

  .CircularProgressbar-trail {
    stroke: transparent;
  }
`;

export default CircleRating;
