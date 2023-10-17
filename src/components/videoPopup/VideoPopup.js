import React from "react";
import ReactPlayer from "react-player/youtube";
import styled, { keyframes } from "styled-components";
import { Close } from "@material-ui/icons";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const VideoPopup = ({ show, setShow, videoId, setVideoId }) => {
  const hidePopup = () => {
    setShow(false);
    setVideoId(null);
  };

  return (
    <VideoPopupWrapper className={show ? "visible" : ""}>
      <OpacityLayer onClick={hidePopup} />
      <VideoPlayer className={show ? "open" : ""}>
        <CloseButton onClick={hidePopup}>
          <Close />
          <span>Close</span>
        </CloseButton>
        {videoId ? (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            controls
            width="100%"
            height="100%"
          />
        ) : (
          <UnavailableVideo className={show ? "open" : ""}>
            <HighlightOffIcon />
            <h1>Sorry, video is unavailable</h1>
          </UnavailableVideo>
        )}
      </VideoPlayer>
    </VideoPopupWrapper>
  );
};

const popupAnimation = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const VideoPopupWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  z-index: 1000;

  &.visible {
    opacity: 1;
    visibility: visible;
  }
`;

const OpacityLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const VideoPlayer = styled.div`
  position: relative;
  width: 800px;
  aspect-ratio: 16 / 9;
  transform: scale(1);
  transition: transform 250ms;

  &.open {
    animation: ${popupAnimation} 0.3s ease-in-out;
  }
`;

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.navBackground};
  color: #fff;
  padding: 5px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
  transition: 0.2s ease-in-out;
  margin-bottom: 10px;

  svg {
    margin-right: 5px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const UnavailableVideo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 800px;
  aspect-ratio: 16 / 9;
  transform: scale(1);
  transition: transform 250ms;
  background-color: ${(props) => props.theme.navBackground};

  &.open {
    animation: ${popupAnimation} 0.3s ease-in-out;
  }

  svg {
    font-size: 50px;
  }
`;

export default VideoPopup;
