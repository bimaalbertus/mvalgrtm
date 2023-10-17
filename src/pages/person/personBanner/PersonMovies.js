import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import dayjs from "dayjs";
import Img from "../../../components/lazyLoadImage/Img";
import PosterFallback from "../../../assets/no-poster.png";
import CircleRating from "../../../components/circleRating/CircleRating";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";

function slugify(string) {
  return string
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

const skItem = () => {
  return (
    <StyledSkeletonItem>
      <div className="posterBlock skeleton"></div>
      <div className="textBlock">
        <div className="title skeleton"></div>
        <div className="date skeleton"></div>
      </div>
    </StyledSkeletonItem>
  );
};

const PersonMovies = ({ movies, loading, endpoint, setEndpoint, title }) => {
  const navigate = useNavigate();
  const carouselContainer = useRef();

  const onTabChange = (tab) => {
    setEndpoint(tab === "Movies" ? "movie" : "tv");
  };

  const navigation = (dir) => {
    const container = carouselContainer.current;

    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });

    const isFirstSlide = scrollAmount < 1;
    const isLastSlide =
      scrollAmount >= container.scrollWidth - container.offsetWidth;

    setIsFirstSlide(isFirstSlide);
    setIsLastSlide(isLastSlide);
  };

  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);

  const [genres, setGenres] = useState({});

  useEffect(() => {
    async function fetchGenres() {
      const request = await axios.get(
        `https://api.themoviedb.org/3/genre/${endpoint}/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
      );
      const genres = {};
      request.data.genres.forEach((genre) => {
        genres[genre.id] = genre.name;
      });
      setGenres(genres);
    }
    fetchGenres();
  }, [endpoint]);

  return (
    <ContentWrapper>
      <>
        <SwitchTabs data={["Movies", "TV Shows"]} onTabChange={onTabChange} />
        <StyledCarousel>
          <StyledContentWrapper>
            <div className="carouselTitle">{title}</div>
            {movies.length > 7 && (
              <Arrows>
                {!isFirstSlide ? (
                  <ArrowBackIos onClick={() => navigation("left")} />
                ) : (
                  <ArrowBackIos
                    style={{
                      color: "rgba(255, 255, 255, 0.1)",
                      cursor: "default",
                    }}
                  />
                )}
                {!isLastSlide ? (
                  <ArrowForwardIos onClick={() => navigation("right")} />
                ) : (
                  <ArrowForwardIos
                    style={{
                      color: "rgba(255, 255, 255, 0.1)",
                      cursor: "default",
                    }}
                  />
                )}
              </Arrows>
            )}
            {!loading ? (
              <StyledCarouselItems ref={carouselContainer}>
                {movies?.map((movie) => {
                  const posterUrl = movie.poster_path
                    ? "https://image.tmdb.org/t/p/original/" + movie.poster_path
                    : PosterFallback;
                  return (
                    <StyledCarouselItem
                      key={movie.id}
                      onClick={() =>
                        navigate(
                          `/${endpoint}/${movie.id}-${slugify(
                            movie.title || movie.name?.toLowerCase()
                          )}`
                        )
                      }
                    >
                      <div className="posterBlock">
                        <Img src={posterUrl} />
                        <CircleRating rating={movie.vote_average.toFixed(1)} />
                        <GenresWrapper>
                          {movie.genre_ids.slice(0, 2).map((genreId) => (
                            <StyledGenres>
                              <StyledGenre>{genres[genreId]}</StyledGenre>
                            </StyledGenres>
                          ))}
                        </GenresWrapper>
                      </div>
                      <div className="textBlock">
                        <span className="title">
                          {movie.title || movie.name}
                        </span>
                        <span className="date">
                          {dayjs(
                            movie.release_date || movie.first_air_date
                          ).format("YYYY")}
                        </span>
                      </div>
                    </StyledCarouselItem>
                  );
                })}
              </StyledCarouselItems>
            ) : (
              <StyledLoadingSkeleton>
                {skItem()}
                {skItem()}
                {skItem()}
                {skItem()}
                {skItem()}
              </StyledLoadingSkeleton>
            )}
          </StyledContentWrapper>
        </StyledCarousel>
      </>
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Arrows = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: flex-end;

  svg {
    margin: 10px;
    color: ${(props) => props.theme.textColor};

    &:hover {
      color: #c0c0c0;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledCarousel = styled.div`
  margin-bottom: 50px;
`;

const StyledContentWrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;

  .carouselTitle {
    font-size: 24px;
    color: white;
    margin-bottom: 20px;
    font-weight: normal;
    color: ${(props) => props.theme.textColor};
  }

  .carouselLeftNav {
    left: 30px;
  }

  .carouselRighttNav {
    right: 30px;
  }
`;

const StyledSkeletonItem = styled.div`
  width: 200px;
  flex-shrink: 0;

  .posterBlock {
    border-radius: 12px;
    width: 100%;
    aspect-ratio: 1 / 1.5;
    margin-bottom: 30px;
  }

  .textBlock {
    display: flex;
    flex-direction: column;

    .title {
      width: 100%;
      height: 20px;
      margin-bottom: 10px;
    }

    .date {
      width: 75%;
      height: 20px;
    }
  }
`;

const StyledCarouselItems = styled.div`
  display: flex;
  gap: 10px;
  overflow-y: hidden;
  margin-right: -20px;
  margin-left: -20px;
  padding: 0 20px;

  @media (min-width: 768px) {
    gap: 20px;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledCarouselItem = styled.div`
  width: 200px;
  cursor: pointer;
  flex-shrink: 0;
  padding-top: 10px;

  .posterBlock {
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
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }

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
  }

  .textBlock {
    color: white;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 16px;
      margin-bottom: 10px;
      line-height: 24px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: ${(props) => props.theme.textColor};

      @media (min-width: 768px) {
        font-size: 20px;
      }
    }

    .date {
      font-size: 14px;
      opacity: 0.5;
      color: ${(props) => props.theme.textColor};
    }
  }
`;

const StyledLoadingSkeleton = styled.div`
  display: flex;
  gap: 10px;
  overflow-y: hidden;
  margin-right: -20px;
  margin-left: -20px;
  padding: 0 20px;

  @media (min-width: 768px) {
    gap: 20px;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
`;

const GenresWrapper = styled.div`
  display: flex;
  gap: 5px;
  flex-flow: wrap;
  justify-content: flex-end;
  max-width: 140px;
`;

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

export default PersonMovies;
