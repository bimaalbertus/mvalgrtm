import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import Img from "../../../components/lazyLoadImage/Img";
import avatar from "../../../assets/avatar.png";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function slugify(string) {
  return string
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

const Cast = ({ mediaType, id }) => {
  const carouselContainer = useRef();
  const navigate = useNavigate();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        setCast(response.data.cast);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cast:", error);
      }
    };

    fetchCast();
  }, [mediaType, id]);

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

  const LoadingSkeleton = () => {
    return (
      <CastSection>
        <ContentWrapper>
          <ListItemsSkeleton>
            {Array.from({ length: 8 }).map((_, index) => (
              <ListItem>
                <span className="loading-actor-profile"></span>
                <div className="loading-profile">
                  <span className="loading-actor-name"></span>
                  <span className="loading-character"></span>
                </div>
              </ListItem>
            ))}
          </ListItemsSkeleton>
        </ContentWrapper>
      </CastSection>
    );
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <CastSection>
      <ContentWrapper>
        <Title>Cast</Title>
        {cast.length > 6 && (
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
        <ListItems ref={carouselContainer}>
          {cast?.map((item) => {
            let imgUrl = item.profile_path
              ? "https://image.tmdb.org/t/p/original/" + item.profile_path
              : avatar;
            return (
              <Link
                to={`/person/${item.id}-${slugify(item.name?.toLowerCase())}`}
              >
                <ListItem key={item.id}>
                  <ProfileImg>
                    <Img src={imgUrl} />
                  </ProfileImg>
                  <Name>{item.name}</Name>
                  <Character>{item.character}</Character>
                </ListItem>
              </Link>
            );
          })}
        </ListItems>
      </ContentWrapper>
    </CastSection>
  );
};

export default Cast;

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

const ContentWrapper = styled.div`
  width: 100%;
  padding: 50px 0 0 0;
`;

const CastSection = styled.div`
  position: relative;
  margin-bottom: 50px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: white;
  margin-bottom: 25px;
`;

const ListItems = styled.div`
  display: flex;
  gap: 30px;
  overflow-y: hidden;
  margin-right: -20px;
  margin-left: -20px;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.div`
  text-align: center;
  color: white;
`;

const ProfileImg = styled.div`
  width: 200px;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px 0 15px 0;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 175px;
    height: 275px;
    margin-bottom: 25px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const Name = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 24px;
  }
`;

const Character = styled.div`
  font-size: 14px;
  line-height: 20px;
  opacity: 0.5;
  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 24px;
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

const ListItemsSkeleton = styled.div`
  display: flex;
  gap: 30px;
  overflow-y: hidden;
  margin-right: -20px;
  margin-left: -20px;
  padding: 0 20px;

  .loading-actor-profile {
    width: 200px;
    height: 300px;
    border-radius: 5px;
    display: block;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }

  .loading-profile {
    height: 14px;
    width: 60%;
    margin: auto;
    border-radius: 5px;
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;
