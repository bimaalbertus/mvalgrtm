import React, { useEffect, useState } from "react";
import axios from "axios";
import Img from "../../../../components/lazyLoadImage/Img";
import { styled, keyframes } from "styled-components";
import useFetch from "../../../../hooks/useFetch";
import PosterFallback from "../../../../assets/no-poster-landscape.png";
import { Link } from "react-router-dom";

const EpisodePoster = ({ id, mediaType, seasonNumber }) => {
  const { data: episodeData, loading: episodeLoading } = useFetch(
    `/tv/${id}/season/${seasonNumber}`
  );

  const LoadingSkeleton = () => {
    return (
      <CastSection>
        <ContentWrapper>
          <ListItemsSkeleton>
            {Array.from({ length: 3 }).map((_, index) => (
              <ListItem>
                <span className="loading-poster"></span>
                <div className="loading-detail">
                  <span className="loading-actor-name"></span>
                  <span className="loading-character"></span>
                </div>
              </ListItem>
            ))}
          </ListItemsSkeleton>
        </ContentWrapper>
      </CastSection>
    );
  };

  if (episodeLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Wrapper>
      {!!episodeData &&
        episodeData.episodes.map((episode) => {
          const posterUrl = episode.still_path
            ? "https://image.tmdb.org/t/p/original/" + episode.still_path
            : PosterFallback;
          return (
            <Container
              to={`/tv/${id}/season/${seasonNumber}/episode/${episode.episode_number}`}
              key={episode.id}
            >
              <Img
                src={posterUrl}
                alt={`Episode ${episode.episode_number} Poster`}
              />
              <h2 className="episodeName">{episode.name}</h2>
              <div className="episodeNumber">
                Episode {episode.episode_number}
              </div>
            </Container>
          );
        })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  max-width: 1100px;
  padding: 40px 0 0 0;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
`;

const Container = styled(Link)`
  margin: 20px 20px 20px 0;

  img {
    width: 350px;
  }

  .episodeName {
    margin: 10px 0 0 5px;
    font-size: 16px;
  }

  .episodeNumber {
    font-size: 13px;
    margin: 10px 0 0 5px;
    color: ${(props) => props.theme.spanColor};
  }

  @media (max-width: 768px) {
    img {
      width: 170px;
    }
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 50px 0 0 0;
`;

const CastSection = styled.div`
  position: relative;
  margin-bottom: 50px;
`;

const ListItem = styled.div`
  text-align: center;
  color: white;
`;

const skeletonAnimation = keyframes`
  0% {
    background-position: -200%;
  }
  100% {
    background-position: 200%;
  }
`;

const ListItemsSkeleton = styled.div`
  display: flex;
  gap: 30px;
  overflow-y: hidden;
  margin-right: -20px;
  margin-left: -20px;
  padding: 0 20px;

  .loading-poster {
    width: 350px;
    height: 200px;
    border-radius: 5px;
    display: block;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }

  .loading-detail {
    height: 14px;
    width: 60%;
    margin: auto;
    border-radius: 5px;
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default EpisodePoster;
