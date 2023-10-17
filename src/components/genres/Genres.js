import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Genres = ({ data }) => {
  const { genres } = useSelector((state) => state.home);

  return (
    <StyledGenres>
      {data?.map((g) => {
        if (!genres[g]?.name) return;
        return (
          <div key={g} className="genre">
            {genres[g]?.name}
          </div>
        );
      })}
    </StyledGenres>
  );
};

const StyledGenres = styled.div`
  display: flex;
  gap: 5px;
  z-index: 2;
`;

const StyledGenre = styled.div`
  background-color: #da2f68;
  padding: 3px 5px;
  font-size: 12px;
  border-radius: 4px;
  color: white;
  white-space: nowrap;
`;

export default Genres;
