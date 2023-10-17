import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import styled, { keyframes } from "styled-components";
import Img from "../../../components/lazyLoadImage/Img";
import PosterFallback from "../../../assets/no-poster.png";
import dayjs from "dayjs";
import PersonMovies from "./PersonMovies";
import ShowMoreText from "react-show-more-text";
import PersonImage from "./PersonImage";
import PersonSocialMedia from "./SocialMedia";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function LoadingSkeleton() {
  return (
    <LoadingContainer>
      <div className="detailsBannerSkeleton">
        <div className="left skeleton"></div>
        <div className="right">
          <div className="row skeleton"></div>
          <div className="row skeleton"></div>
          <div className="row skeleton"></div>
          <div className="row skeleton"></div>
          <div className="row skeleton"></div>
          <div className="row skeleton"></div>
          <div className="row skeleton"></div>
        </div>
      </div>
    </LoadingContainer>
  );
}

const PersonBanner = () => {
  const { id } = useParams();
  const { data: person, loading } = useFetch(`/person/${id}`);
  const [movies, setMovies] = useState([]);
  const [movieLoading, setLoading] = useState(true);
  const [endpoint, setEndpoint] = useState("movie");
  const [directedMovies, setDirectedMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      const response = await fetch(
        `https://api.themoviedb.org/3/person/${id}/${endpoint}_credits?api_key=${API_KEY}`
      );
      const data = await response.json();
      setMovies(data.cast);
      setLoading(false);
      setDirectedMovies(
        data.crew.filter((credit) => credit.job === "Director")
      );
    }
    fetchMovies();
  }, [id, endpoint]);

  const googleClick = () => {
    const googleSearchUrl = `https://www.google.com/search?q=${person.name}`;
    window.open(googleSearchUrl, "_blank");
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Wrapper>
      {!!person && (
        <PersonDetail>
          {person.profile_path ? (
            <ImageWrap>
              <Img
                className="posterImg"
                src={
                  "https://image.tmdb.org/t/p/original/" + person.profile_path
                }
              />
              <span className="google-btn" onClick={googleClick}>
                Google It!
              </span>
            </ImageWrap>
          ) : (
            <Img className="posterImg" src={PosterFallback} />
          )}
          <DetailContainer>
            <h1>{person.name}</h1>
            <DetailItem>
              <DetailTitle>Known for: </DetailTitle>
              <span className="detail-data">{person.known_for_department}</span>
            </DetailItem>
            <DetailItem>
              <DetailTitle>Born: </DetailTitle>
              <span className="detail-data">
                {person.birthday
                  ? dayjs(person.birthday).format("DD MMM YYYY")
                  : "-"}
                , {person.place_of_birth}
              </span>
            </DetailItem>
            <DetailItem>
              <DetailTitle>Age: </DetailTitle>
              <span className="detail-data">
                {person.deathday === null
                  ? Math.floor(
                      (new Date() - new Date(person.birthday)) / 31557600000
                    )
                  : `passed away at the age of ${Math.floor(
                      (new Date(person.deathday) - new Date(person.birthday)) /
                        31557600000
                    )}`}
              </span>
            </DetailItem>
            {person.deathday && (
              <DetailItem>
                <DetailTitle>Death Day: </DetailTitle>
                <span className="detail-data">
                  {dayjs(person.deathday).format("DD MMM YYYY")}
                </span>
              </DetailItem>
            )}
            {person.biography ? (
              <Bio
                lines={4}
                more="Read More"
                less="Read Less"
                expanded={false}
                width={600}
              >
                {person.biography.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Bio>
            ) : (
              "No biography available."
            )}
            <PersonSocialMedia id={id} />
          </DetailContainer>
        </PersonDetail>
      )}
      <center>
        <PersonImage />
      </center>
      <PersonMovies
        movies={movies}
        loading={movieLoading}
        endpoint={endpoint}
        setEndpoint={setEndpoint}
        title="Movies and TV Shows"
      />
      {directedMovies.length > 0 && (
        <PersonMovies
          movies={directedMovies}
          loading={movieLoading}
          endpoint={endpoint}
          setEndpoint={setEndpoint}
          title="Directed Movies and TV Shows"
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  color: ${(props) => props.theme.textColor};
  padding: 20px;

  .posterImg {
    width: 250px;
  }
`;

const PersonDetail = styled.div`
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const ImageWrap = styled.div`
  display: flex;
  flex-direction: column;

  .google-btn {
    background-color: ${(props) => props.theme.sidebarBackground};
    padding: 10px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    width: 250px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;

const DetailContainer = styled.div`
  margin-left: 20px;

  h3 {
    color: ${(props) => props.theme.spanColor};
  }

  .detail-data {
    font-size: 14px;
    color: ${(props) => props.theme.spanColor};
  }

  .separator {
    color: #808080;
    margin: 0 5px;
  }

  .biography-text {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    margin-left: 0;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const DetailTitle = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const Bio = styled(ShowMoreText)`
  font-size: 14px;

  p {
    max-width: 600px;

    @media (max-width: 768px) {
      max-width: 80%;
    }
  }
`;

const skeletonAnimation = keyframes`
  0% {
    background-position: -200%;
  }
  100% {
    background-position: 200%;
  }
`;

const LoadingContainer = styled.div`
  .detailsBannerSkeleton {
    display: flex;
    position: relative;
    flex-direction: column;
    gap: 25px;

    @media (min-width: 768px) {
      gap: 50px;
      flex-direction: row;
    }

    .left {
      flex-shrink: 0;
      width: 250px;
      display: block;
      border-radius: 12px;
      aspect-ratio: 1/1.5;
      background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
      background-size: 200% 100%;
      animation: ${skeletonAnimation} 1.5s infinite;

      @media (min-width: 768px) {
        max-width: 350px;
      }
    }

    .right {
      width: 100%;
    }

    .row {
      width: 100%;
      height: 25px;
      margin-bottom: 20px;
      border-radius: 50px;
      background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
      background-size: 200% 100%;
      animation: ${skeletonAnimation} 1.5s infinite;
    }

    .row:nth-child(2) {
      width: 75%;
      margin-bottom: 50px;
    }

    .row:nth-child(5) {
      width: 50%;
      margin-bottom: 50px;
    }
  }
`;

export default PersonBanner;
