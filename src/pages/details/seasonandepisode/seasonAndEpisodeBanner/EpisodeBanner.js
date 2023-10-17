import React, { useState, useEffect } from "react";
import axios from "axios";
import Img from "../../../../components/lazyLoadImage/Img";
import { styled, keyframes } from "styled-components";
import useFetch from "../../../../hooks/useFetch";
import PosterFallback from "../../../../assets/no-poster-landscape.png";
import { Link, useParams } from "react-router-dom";
import ShowMoreText from "react-show-more-text";
import DetailButton from "../../DetailButton";
import dayjs from "dayjs";
import AudienceRatingSvg from "../../audienceReview/AudienceRatingSvg";
import Crew from "../../detailsBanner/Crew";

const toHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${minutes > 0 ? ` ${minutes}m` : ""}`;
};

const EpisodeBanner = ({
  id,
  mediaType,
  seasonNumber,
  tvData,
  video,
  episodeNumber,
  credits,
}) => {
  const { data, loading } = useFetch(
    `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`
  );

  if (loading) {
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

  return (
    <Wrapper>
      {!!data && (
        <Detail>
          <Img
            className="posterImg"
            src={
              data.still_path
                ? "https://image.tmdb.org/t/p/original/" + data.still_path
                : PosterFallback
            }
          />
          <DetailContainer>
            <h2>{tvData && tvData.name}</h2>
            <h3>{data.name}</h3>
            <div className="detail-data">
              {`Season ${seasonNumber} Episode ${episodeNumber}`}
            </div>
            <div>
              <span className="detail-data">
                {dayjs(data.air_date).format("MMM DD, YYYY")}
              </span>
              <span className="separator"> • </span>
              <span className="detail-data">
                {toHoursAndMinutes(data.runtime)}
              </span>
            </div>
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
              {data.overview}
            </Overview>
            <Crew crew={credits?.crew} />
          </DetailContainer>
        </Detail>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  color: #fff;

  .posterImg {
    width: 350px;
  }
`;

const Detail = styled.div`
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const DetailContainer = styled.div`
  margin-left: 20px;

  .detail-data {
    font-size: 14px;
    color: #c0c0c0;
    margin-bottom: 15px;
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

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-top: -5px;

  .rating {
    font-size: 12px;
    margin: 0 0 2px 5px;
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

export default EpisodeBanner;
