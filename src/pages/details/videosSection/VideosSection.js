import React, { useState } from "react";
import styled, { css } from "styled-components";
import VideoPopup from "../../../components/videoPopup/VideoPopup";
import Img from "../../../components/lazyLoadImage/Img";
import { PlayIcon } from "../PlayBtn";
import { ArrowBackIos, ArrowForwardIos, Close } from "@material-ui/icons";

const VideosSection = ({ data, loading }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const carouselContainer = React.useRef();

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

  const loadingSkeleton = () => {
    return (
      <SkeletonItem>
        <SkeletonThumb className="skeleton"></SkeletonThumb>
        <SkeletonRow className="skeleton"></SkeletonRow>
        <SkeletonRow2 className="skeleton"></SkeletonRow2>
      </SkeletonItem>
    );
  };

  return (
    <VideosSectionContainer>
      <ContentWrapper>
        <SectionHeading>Official Videos</SectionHeading>
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
        {!loading ? (
          <VideosWrapper ref={carouselContainer}>
            {data?.results?.map((video) => (
              <VideoItem
                key={video.id}
                onClick={() => {
                  setVideoId(video.key);
                  setShow(true);
                }}
              >
                <VideoThumbnail>
                  <Img
                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                  />
                  <PlayIcon />
                </VideoThumbnail>
                <VideoTitle>{video.name}</VideoTitle>
              </VideoItem>
            ))}
          </VideosWrapper>
        ) : (
          <VideoSkeletonWrapper>
            {loadingSkeleton()}
            {loadingSkeleton()}
            {loadingSkeleton()}
            {loadingSkeleton()}
          </VideoSkeletonWrapper>
        )}
      </ContentWrapper>
      <VideoPopup
        show={show}
        setShow={setShow}
        videoId={videoId}
        setVideoId={setVideoId}
      />
    </VideosSectionContainer>
  );
};

const Arrows = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: flex-end;
  margin: 0 0 20px 0;

  svg {
    margin: 10px;
    color: rgba(255, 255, 255, 0.5);

    &:hover {
      color: #fff;
    }
  }
`;

const VideosSectionContainer = styled.div`
  position: relative;
  margin-bottom: 50px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 50px 0 0 0;
`;

const SectionHeading = styled.h2`
  font-size: 24px;
  color: white;
  margin-bottom: 25px;
`;

const VideosWrapper = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-right: -20px;
  margin-left: -20px;
  padding: 0 20px;

  ${(props) =>
    props.isMedium &&
    css`
      gap: 20px;
      margin: 0;
      padding: 0;
    `}

  &::-webkit-scrollbar {
    display: none;
  }
`;

const VideoItem = styled.div`
  width: 350px;
  flex-shrink: 0;

  ${(props) =>
    props.isMedium &&
    css`
      width: 25%;
    `}

  cursor: pointer;
`;

const VideoThumbnail = styled.div`
  margin-bottom: 15px;
  position: relative;

  img {
    width: 100%;
    display: block;
    border-radius: 12px;
    transition: all 0.7s ease-in-out;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
  }

  .triangle {
    stroke-dasharray: 240;
    stroke-dashoffset: 480;
    stroke: white;
    transform: translateY(0);
    transition: all 0.7s ease-in-out;
  }

  .circle {
    stroke: white;
    stroke-dasharray: 650;
    stroke-dashoffset: 1300;
    transition: all 0.5s ease-in-out;
  }

  &:hover {
    img {
      opacity: 0.5;
    }
    .triangle {
      stroke-dashoffset: 0;
      opacity: 1;
      stroke: var(--pink);
      animation: trailorPlay 0.7s ease-in-out;
    }
    .circle {
      stroke-dashoffset: 0;
      stroke: var(--pink);
    }
  }
`;

const VideoTitle = styled.p`
  color: white;
  font-size: 14px;
  line-height: 20px;
  max-width: 300px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${(props) =>
    props.isMedium &&
    css`
      font-size: 16px;
      line-height: 24px;
    `}
`;

const VideoSkeletonWrapper = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-right: -20px;
  margin-left: -20px;
  padding: 0 20px;

  ${(props) =>
    props.isMedium &&
    css`
      gap: 20px;
      margin: 0;
      padding: 0;
    `}
`;

const SkeletonItem = styled.div`
  width: 150px;
  flex-shrink: 0;

  ${(props) =>
    props.isMedium &&
    css`
      width: 25%;
    `}
`;

const SkeletonThumb = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  margin-bottom: 10px;
`;

const SkeletonRow = styled.div`
  height: 20px;
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const SkeletonRow2 = styled.div`
  height: 20px;
  width: 75%;
  border-radius: 10px;
`;

export default VideosSection;
