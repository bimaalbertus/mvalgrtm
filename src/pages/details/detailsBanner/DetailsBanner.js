import React from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import styled, { keyframes } from "styled-components";
import Img from "../../../components/lazyLoadImage/Img";
import PosterFallback from "../../../assets/no-poster.png";
import dayjs from "dayjs";
import AudienceRatingSvg from "../audienceReview/AudienceRatingSvg";
import Crew from "./Crew";
import DetailButton from "../DetailButton";
import ShowMoreText from "react-show-more-text";

const DetailsBanner = ({ credits, video }) => {
  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}`);
  const genreNames = data?.genres?.map((genre) => genre.name).join(", ");

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  return (
    <Wrapper>
      {!loading ? (
        <>
          {!!data && (
            <MovieDetail>
              {data.poster_path ? (
                <ImageWrap>
                  <Img
                    className="posterImg"
                    src={
                      "https://image.tmdb.org/t/p/original/" + data.poster_path
                    }
                  />
                  <span className="additional-not-btn">
                    {mediaType === "movie"
                      ? toHoursAndMinutes(data.runtime)
                      : data.number_of_seasons === 1
                      ? data.number_of_seasons + " Season"
                      : data.number_of_seasons + " Seasons"}
                  </span>
                </ImageWrap>
              ) : (
                <Img className="posterImg" src={PosterFallback} />
              )}
              <DetailContainer>
                {mediaType === "movie" ? (
                  <div>
                    <h1>{data.title}</h1>
                    <div>
                      <span className="detail-data">
                        {dayjs(data?.release_date).format("YYYY")}
                      </span>
                      <span className="separator"> • </span>
                      <span className="detail-data">
                        {toHoursAndMinutes(data.runtime)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1>{data.name}</h1>
                    <div>
                      <span className="detail-data">
                        {dayjs(data.first_air_date).format("YYYY")}
                      </span>
                      <span className="separator"> • </span>
                      <span className="detail-data">
                        {data.number_of_seasons === 1
                          ? data.number_of_seasons + " Season"
                          : data.number_of_seasons + " Seasons"}
                      </span>
                    </div>
                  </div>
                )}
                <Genre>
                  <span className="genres">{genreNames}</span>
                </Genre>
                <Rating>
                  <AudienceRatingSvg width={15} />
                  <span className="rating">
                    {(data.vote_average * 10).toFixed(0)}%
                  </span>
                </Rating>
                <DetailButton mediaType={mediaType} id={id} video={video} />
                <Overview
                  lines={4}
                  more="Read More"
                  less="Read Less"
                  expanded={false}
                  width={600}
                >
                  {data.overview.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </Overview>
                <Crew crew={credits?.crew} />
              </DetailContainer>
            </MovieDetail>
          )}
        </>
      ) : (
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
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  color: #fff;

  .posterImg {
    width: 250px;
  }
`;

const MovieDetail = styled.div`
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const ImageWrap = styled.div`
  display: flex;
  flex-direction: column;

  .additional-not-btn {
    background-color: ${(props) => props.theme.sidebarBackground};
    padding: 10px;
    text-align: center;
    font-size: 12px;
    transition: 0.2s ease-in-out;
    width: 250px;
  }
`;

const DetailContainer = styled.div`
  margin-left: 20px;

  .detail-data {
    font-size: 14px;
    color: #c0c0c0;
  }

  .separator {
    color: #808080;
    margin: 0 5px;
  }

  .genres {
    margin-right: 10px;
    font-size: 14px;
    color: #c0c0c0;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    margin-left: 0;
  }
`;

const Genre = styled.div`
  display: flex;
  margin-top: 10px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;

  .rating {
    font-size: 12px;
    margin: 0 0 2px 5px;
  }
`;

const Overview = styled(ShowMoreText)`
  font-size: 14px;
  margin-top: 20px;

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

export default DetailsBanner;
