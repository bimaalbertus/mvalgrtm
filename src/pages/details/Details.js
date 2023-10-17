import React, { useState, useEffect } from "react";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Review from "./audienceReview/Review";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import styled, { useTheme } from "styled-components";
import ReviewSlider from "./audienceReview/ReviewSlider";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import SeasonPoster from "./seasonandepisode/Poster/SeasonPoster";

const Details = () => {
  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);
  const { data: backdrop, loading: backdropLoading } = useFetch(
    `/${mediaType}/${id}`
  );
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );
  const officialTrailer = data?.results?.find(
    (video) => video.type === "Trailer"
  );
  const { data: seasonsData, loading: seasonsLoading } = useFetch(`/tv/${id}`);
  const [avgColor, setAvgColor] = useState("#FFFFFF");

  useEffect(() => {
    if (data && data.backdrop_path) {
      const imagePath = `https://image.tmdb.org/t/p/original/${data.backdrop_path}`;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imagePath;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;

        const imageData = context.getImageData(0, 0, img.width, img.height);
        const pixelData = imageData.data;

        for (let i = 0; i < pixelData.length; i += 4) {
          totalR += pixelData[i];
          totalG += pixelData[i + 1];
          totalB += pixelData[i + 2];
        }

        const averageR = Math.floor(totalR / (pixelData.length / 4));
        const averageG = Math.floor(totalG / (pixelData.length / 4));
        const averageB = Math.floor(totalB / (pixelData.length / 4));

        const darkenPercentage = 0.2;
        const darkenedR = Math.floor(averageR * (1 - darkenPercentage));
        const darkenedG = Math.floor(averageG * (1 - darkenPercentage));
        const darkenedB = Math.floor(averageB * (1 - darkenPercentage));

        const rgbColor = `rgb(${darkenedR}, ${darkenedG}, ${darkenedB}, 0.5)`;
        setAvgColor(rgbColor);
      };
    }
  }, [data]);

  return (
    <Container>
      <BlurredBackgroundOverlay avgColor={avgColor} />
      <BlurredBackground
        imagePath={`https://image.tmdb.org/t/p/original/${backdrop?.backdrop_path}`}
      />
      <DetailsBanner credits={credits} video={officialTrailer} />
      {mediaType === "tv" && <SeasonPoster id={id} mediaType={mediaType} />}
      <Cast mediaType={mediaType} id={id} />
      <ReviewSlider mediaType={mediaType} id={id} />
      <VideosSection data={data} loading={loading} />
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

export default Details;
