import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";

const MovieCard = ({ data, navigate, mediaType, fromSearch }) => {
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/original/${data.poster_path}`
    : PosterFallback;

  return (
    <StyledMovieCard
      onClick={() =>
        navigate(`/${data.media_type || mediaType}/${data.id}-${data.title}`)
      }
    >
      <PosterBlock>
        <Img className="posterImg" src={posterUrl} />
        {!fromSearch && (
          <>
            <CircleRating rating={data.vote_average.toFixed(1)} />
            <Genres data={data.genre_ids.slice(0, 2)} />
          </>
        )}
      </PosterBlock>
      <TextBlock>
        <Title>{data.title || data.name}</Title>
        <Date>{dayjs(data.release_date).format("MMM D, YYYY")}</Date>
      </TextBlock>
    </StyledMovieCard>
  );
};

const PosterBlock = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.5;
  background-size: cover;
  background-position: center;
  margin-bottom: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 10px;
  transition: all ease 0.5s;

  .lazy-load-image-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .circleRating {
    width: 40px;
    height: 40px;
    position: relative;
    top: 30px;
    background-color: white;
    flex-shrink: 0;
    @media (min-width: 768px) {
      width: 50px;
      height: 50px;
    }
  }

  .genres {
    display: none;
    position: relative;
    @media (min-width: 768px) {
      display: flex;
      flex-flow: wrap;
      justify-content: flex-end;
    }
  }
`;

const StyledMovieCard = styled.div`
  width: calc(50% - 5px);
  margin-bottom: 25px;
  cursor: pointer;
  flex-shrink: 0;
  @media (min-width: 768px) {
    width: calc(25% - 15px);
  }
  @media (min-width: 992px) {
    width: calc(20% - 16px);
  }

  &:hover {
    ${PosterBlock} {
      opacity: 0.5;
    }
  }
`;

const TextBlock = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  font-size: 16px;
  margin-bottom: 10px;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const Date = styled.span`
  font-size: 14px;
  opacity: 0.5;
`;

export default MovieCard;
