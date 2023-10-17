import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import VideoPopup from "../../components/videoPopup/VideoPopup";

const DetailButton = ({ mediaType, id, video, marginTop }) => {
  const [videoId, setVideoId] = useState(null);
  const [show, setShow] = useState(false);

  return (
    <>
      <Wrapper marginTop={marginTop}>
        <TrailerButton
          onClick={() => {
            setVideoId(video.key || null);
            setShow(true);
          }}
        >
          <PlayArrowIcon />
          <span>Watch Trailer</span>
        </TrailerButton>
        <AddToFavBtn />
      </Wrapper>
      <VideoPopup
        show={show}
        setShow={setShow}
        videoId={videoId || null}
        setVideoId={setVideoId}
      />
    </>
  );
};

const Wrapper = styled.div`
  margin: ${({ marginTop }) => marginTop}px 0 20px 0;
  display: flex;
  align-items: center;
`;

const TrailerButton = styled.div`
  padding: 5px;
  background-color: ${(props) => props.theme.activeColor};
  color: #1c1c1c;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  opacity: 0.8;
  margin-right: 10px;
  border-radius: 5px;

  svg {
    font-size: 30px;
    font-weight: bold;
  }

  &:hover {
    opacity: 1;
  }
`;

const AddToFavBtn = styled(BookmarkIcon)`
  color: transparent;
  stroke: #fff;
`;

export default DetailButton;
