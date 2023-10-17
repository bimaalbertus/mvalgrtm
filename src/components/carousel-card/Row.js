/* eslint-disable react/prop-types */
import axios from "../../utils/axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import { Link } from "react-router-dom";
import Img from "../lazyLoadImage/Img";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export default function Row(props, movie) {
  const slider = React.useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState([]);

  function slugify(string) {
    return string
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  }

  useEffect(() => {
    async function fetchData() {
      const req = await axios.get(props.fetchurl);
      const data = req.data.results.map(async (item) => {
        const {
          id,
          title,
          name,
          backdrop_path,
          poster_path,
          first_air_date,
          overview,
          movie,
          genre_ids,
        } = item;
        let url;
        let isMovie;
        if (first_air_date) {
          url = `/tv/${id}-${slugify(name?.toLowerCase())}`;
          isMovie = false;
        } else {
          url = `/movie/${id}-${slugify(title?.toLowerCase())}`;
          isMovie = true;
        }

        let tagline = "";
        let runtime = "";
        let number_of_seasons = "";
        let number_of_episodes = "";
        let releaseDates = [];
        let contentRatings = [];

        if (isMovie) {
          const movieResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
          );
          tagline = movieResponse.data.tagline;
          runtime = movieResponse.data.runtime;

          const releaseResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${API_KEY}`
          );
          releaseDates = releaseResponse.data.results;
        } else {
          const tvResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
          );
          number_of_seasons = tvResponse.data.number_of_seasons;
          number_of_episodes = tvResponse.data.number_of_episodes;

          const ratingsResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${API_KEY}`
          );
          contentRatings = ratingsResponse.data.results;
        }
        const imageLanguageResponse = isMovie
          ? await axios.get(
              `https://api.themoviedb.org/3/movie/${id}/images?language=en-US&include_image_language=en,null&api_key=${API_KEY}`
            )
          : await axios.get(
              `https://api.themoviedb.org/3/tv/${id}/images?language=en-US&include_image_language=en,null&api_key=${API_KEY}`
            );

        const logos = imageLanguageResponse.data.logos.filter(
          (logo) => logo.iso_639_1 === "en" && logo.file_path
        );

        const backdrops = imageLanguageResponse.data.backdrops.filter(
          (logo) => logo.iso_639_1 === "en" && logo.file_path
        );

        const ratingLabel = getRatingLabel(releaseDates, contentRatings);

        return {
          id,
          title: title,
          name: name,
          backdrop_path,
          poster_path,
          url,
          release_date: item.release_date || item.first_air_date,
          vote_average: item.vote_average,
          category: isMovie ? "Movie" : "TV Show",
          overview: overview,
          movie: movie,
          genre_ids,
          trailerKey: null,
          tagline: tagline,
          runtime: runtime,
          number_of_seasons: number_of_seasons,
          number_of_episodes: number_of_episodes,
          ratingLabel: ratingLabel,
          logos: logos,
          backdrops: backdrops,
        };
      });

      const resolvedData = await Promise.all(data);
      setMovies(resolvedData);
      return req;
    }

    fetchData();
  }, [props.fetchurl]);

  function getRatingLabel(releaseDates, contentRatings) {
    // Ambil sertifikasi usia dari serial TV
    const tvRating = contentRatings.find(
      (rating) => rating.iso_3166_1 === "US"
    );
    if (tvRating) {
      const certification = tvRating.rating;
      if (certification) {
        return certification;
      }
    }

    // Ambil sertifikasi usia dari film
    const usRelease = releaseDates.find(
      (release) => release.iso_3166_1 === "US"
    );
    if (usRelease) {
      const certification = usRelease.release_dates.find(
        (date) => date.certification !== ""
      );
      if (certification) {
        return certification.certification;
      }
    }

    return "";
  }

  const [genres, setGenres] = useState({});

  useEffect(() => {
    async function fetchGenres() {
      const request = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
      );
      const genres = {};
      request.data.genres.forEach((genre) => {
        genres[genre.id] = genre.name;
      });
      setGenres(genres);
    }
    fetchGenres();
  }, []);

  const [getVideo, setGetVideo] = useState({});
  const [showTrailer, setShowTrailer] = useState(false);

  const handleClick = (movie) => {
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`;
    axios
      .get(trailerUrl)
      .then((response) => {
        const videos = response.data.results;
        if (videos.length > 0) {
          const trailer = videos.find((video) => video.type === "Trailer");
          if (trailer) {
            const key = trailer.key;
            setGetVideo({ key: key });
            setShowTrailer(true);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    initialSlide: 0,
    draggable: true,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: true,
        },
      },
    ],
  };

  const slickPrev = () => {
    if (slider.current) {
      slider.current.slickPrev();
    }
  };

  const slickNext = () => {
    if (slider.current) {
      slider.current.slickNext();
    }
  };

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide > 10;

  function formatDuration(duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }

  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <h1>{props.title}</h1>
      <Arrows>
        {!isFirstSlide ? (
          <ArrowBackIos onClick={slickPrev} />
        ) : (
          <ArrowBackIos
            style={{
              color: "rgba(255, 255, 255, 0.1)",
              cursor: "default",
            }}
          />
        )}
        {!isLastSlide ? (
          <ArrowForwardIos onClick={slickNext} />
        ) : (
          <ArrowForwardIos
            style={{
              color: "rgba(255, 255, 255, 0.1)",
              cursor: "default",
            }}
          />
        )}
      </Arrows>
      <MovieRow ref={slider} {...settings}>
        {movies.map((movie) => (
          <>
            <Poster key={movie.id}>
              <Link to={movie.url}>
                <img
                  className="poster_image"
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/can't found the image.jpg";
                  }}
                />
                <Overlay
                  onError={(e) => {
                    e.target.style.backgroundImage = `url(/images/loading-poster.jpg)`;
                  }}
                  backdrop_path={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                >
                  <DetailsWrapper>
                    <ButtonContainer>
                      <Link to={`${movie.url}/watch`}>
                        <WatchButton>▶ Watch Now</WatchButton>
                      </Link>
                    </ButtonContainer>
                    <MovieInfo>
                      <ImageTitle>
                        {movie.logos.slice(0, 1).map((logo) => (
                          <Img
                            key={logo.file_path}
                            src={`https://image.tmdb.org/t/p/w500${logo.file_path}`}
                            alt={movie.title || movie.name}
                          />
                        ))}
                      </ImageTitle>
                      <>
                        <div className="detail-container">
                          {movie.category === "Movie" ? (
                            <>
                              <span className="release-date">
                                {movie.release_date?.substring(0, 4)}
                              </span>
                              <span className="separator"> • </span>
                              <span className="release-date">
                                {formatDuration(movie.runtime)}
                              </span>
                              <span className="separator"> • </span>
                              <span className="certification">
                                {movie.ratingLabel ||
                                  (movie.vote_average / 1).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="release-date">
                                {movie.release_date?.substring(0, 4)}
                              </span>
                              <span className="separator"> • </span>
                              <span className="release-date">
                                {movie.number_of_seasons + " Season"}
                              </span>
                              <span className="separator"> • </span>
                              <span className="certification">
                                {movie.ratingLabel ||
                                  (movie.vote_average / 1).toFixed(2)}
                              </span>
                            </>
                          )}
                          <span className="movie-overview">
                            {movie.overview}
                          </span>
                        </div>
                      </>
                    </MovieInfo>
                  </DetailsWrapper>
                </Overlay>
              </Link>
            </Poster>
          </>
        ))}
      </MovieRow>
    </>
  );
}

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
`;

const MovieRow = styled(Slider)`
  background-color: ${(props) => props.theme.pageBackground};

  & > button {
    opacity: 0;
    z-index: 1;
  }
  .slick-list {
    overflow: initial;
  }
`;

// Komponen Poster
const Poster = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding: 40px 10px 40px 10px;

  .poster_image {
    width: 100%;
    height: auto;
    transition: 0.3s;
  }

  &:hover .poster_image {
    opacity: 0;
    transform: scale(1.2);
  }
`;

const Backdrop = styled.img`
  width: 100%;
`;

// Komponen Overlay
const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
  padding: 20px;
  background: linear-gradient(
      to top,
      ${(props) => props.theme.navBackground} 40%,
      transparent 70%
    ),
    url(http://image.tmdb.org/t/p/original/${(props) => props.backdrop_path});
  background-position: center;
  background-size: cover;

  ${Poster}:hover & {
    opacity: 1;
    transform: scale(1.2);
    transform: translateY(-10px);
  }
`;

const DetailsWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  max-width: 75%;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

// Komponen Tombol Watch
const WatchButton = styled.button`
  background-color: #fff;
  color: #000;
  height: 50px;
  margin: 10px 5px 10px 0px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

// Komponen Tombol Add to Favorite
const AddToFavButton = styled.button`
  background-color: rgba(40, 42, 49, 0.7);
  color: #fff;
  width: 40px;
  padding: 10px;
  margin: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;

  .movie-title {
    display: inline-block;
    text-transform: capitalize;
    font-size: 20px;
    font-weight: bold;
    position: relative;
    flex: 1;
    top: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }

  .movie-overview {
    font-size: 12px;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #fff;
    width: 100%;
  }

  .release-date {
    text-transform: capitalize;
    font-size: 12px;
    margin-top: 15px;
    color: ${(props) => props.theme.additionalColor};
  }
  .detail-container {
    align-items: flex-start;
    justify-content: left;

    .vote-average {
      text-transform: capitalize;
      font-size: 12px;
      margin-top: 15px;
      color: #ff1;
    }

    img {
      margin-top: 18px;
      margin-right: 3px;
      margin-left: 4px;
      width: 10px;
      height: 10px;
    }
  }

  .category {
    text-transform: capitalize;
    font-size: 12px;
    margin-top: 14px;
    margin-left: 4px;
    border: 1px solid gray;
    padding: 0px 4px;
    display: inline-block;
    border-radius: 0px;
  }

  .separator {
    color: #fff;
    margin: 0 5px;
  }

  .certification {
    font-size: 12px;
    background-color: rgba(100, 100, 100, 0.5);
    padding: 1px 3px 1px 3px;
    border-radius: 5px;
  }

  &:hover {
    z-index: 2;
  }

  @media (max-width: 700px) {
    pointer-events: none;
  }

  .info {
    @media (max-width: 1000px) {
      display: none;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  margin: 0px auto;
  width: 100%;

  img {
    margin-bottom: 10px;
    width: 70%;
    filter: drop-shadow(4px 4px 4px rgba(255, 255, 255, 0.5));
  }
`;
