import React from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import styled from "styled-components";
import PersonBanner from "./personBanner/PersonBanner";

const Person = () => {
  const { id, mediaType } = useParams();

  return (
    <Container>
      <PersonBanner />
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme === "light" ? "rgba(0, 0, 0, 0.5)" : "none"};
`;

export default Person;
