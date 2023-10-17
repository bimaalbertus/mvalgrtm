import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const PersonSocialMedia = ({ id }) => {
  const [socialMedia, setSocialMedia] = useState({});

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        const data = await response.json();
        setSocialMedia(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSocialMedia();
  }, [id]);

  return (
    <SocialMedia>
      {socialMedia.instagram_id && (
        <a
          href={`https://www.instagram.com/${socialMedia.instagram_id}`}
          target="_blank"
          rel="noreferrer"
        >
          <InstagramIcon />
        </a>
      )}
      {socialMedia.twitter_id && (
        <a
          href={`https://twitter.com/${socialMedia.twitter_id}`}
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon />
        </a>
      )}
      {socialMedia.facebook_id && (
        <a
          href={`https://www.facebook.com/${socialMedia.facebook_id}`}
          target="_blank"
          rel="noreferrer"
        >
          <FacebookIcon />
        </a>
      )}
    </SocialMedia>
  );
};

const SocialMedia = styled.div`
  display: flex;
  padding: 10px 10px 10px 0;
  border-radius: 20px;

  svg {
    margin-right: 10px;
    font-size: 40px;
    color: ${(props) => props.theme.textColor};
    transition: 0.3s;

    &:hover {
      color: ${(props) => props.theme.spanColor};
    }
  }
`;

export default PersonSocialMedia;
