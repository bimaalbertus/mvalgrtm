import React from "react";
import SeasonBanner from "./seasonAndEpisodeBanner/SeasonBanner";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import styled from "styled-components";
import EpisodeBanner from "./seasonAndEpisodeBanner/EpisodeBanner";
import Cast from "../cast/Cast";
import VideosSection from "../videosSection/VideosSection";

const Episode = () => {
  const { id, seasonNumber, mediaType, episodeNumber } = useParams();
  const { data: backdrop, loading: backdropLoading } = useFetch(`/tv/${id}`);
  const { data: dataVideo, loading: loadingVideo } = useFetch(
    `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/videos`
  );
  const officialTrailer = dataVideo?.results?.find(
    (video) => video.type === "Trailer"
  );
  const { data: tvData, loading: tvLoading } = useFetch(`/tv/${id}`);
  const { data: credits, loading: creditsLoading } = useFetch(
    `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/credits`
  );

  return (
    <Container>
      <BlurredBackgroundOverlay />
      <BlurredBackground
        imagePath={`https://image.tmdb.org/t/p/original/${backdrop?.backdrop_path}`}
      />
      <EpisodeBanner
        id={id}
        mediaType={mediaType}
        tvData={tvData}
        video={dataVideo}
        seasonNumber={seasonNumber}
        episodeNumber={episodeNumber}
        credits={credits}
      />
      <Cast mediaType="tv" id={id} />
      <VideosSection data={dataVideo} loading={loadingVideo} />
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme === "light" ? "rgba(0, 0, 0, 0.5)" : "none"};
`;

const BlurredBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${(props) =>
    props.imagePath
      ? `linear-gradient(to top, ${props.theme.pageBackground} 10%, transparent 100%), url(${props.imagePath})`
      : "none"};
  background-size: cover;
  background-position: center;
  filter: blur(50px);
  z-index: -2;
`;

const BlurredBackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.overlayColor};
  z-index: -1;
`;

export default Episode;
