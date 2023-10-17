import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

function slugify(string) {
  return string
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

const Crew = ({ crew }) => {
  const director = crew?.filter((f) => f.job === "Director");
  const writer = crew?.filter(
    (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
  );

  return (
    <Wrapper>
      {director?.length > 0 && (
        <Info>
          <span className="title">Director</span>
          <span className="content">
            {director?.map((d, i) => (
              <Name to={`/person/${d.id}-${slugify(d.name)}`} key={i}>
                {d.name}
                {director.length - 1 !== i && ", "}
              </Name>
            ))}
          </span>
        </Info>
      )}

      {writer?.length > 0 && (
        <Info>
          <span className="title">Writer</span>
          <span className="content">
            {writer?.map((d, i) => (
              <Name to={`/person/${d.id}-${slugify(d.name)}`} key={i}>
                {d.name}
                {writer.length - 1 !== i && ", "}
              </Name>
            ))}
          </span>
        </Info>
      )}
    </Wrapper>
  );
};

export default Crew;

const Wrapper = styled.div`
  font-size: 14px;
  padding-top: 20px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .title {
    color: #c0c0c0;
    width: 80px;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
`;

const Name = styled(Link)`
  color: #fff;

  &:hover {
    text-decoration: underline;
  }
`;
