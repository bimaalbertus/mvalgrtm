import React, { useState, useEffect } from "react";
import { styled, keyframes } from "styled-components";
import { ArrowBackIos, ArrowForwardIos, Close } from "@material-ui/icons";
import AudienceRatingSvg from "./AudienceRatingSvg";
import dayjs from "dayjs";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { motion, AnimatePresence } from "framer-motion";
import avatar from "../../../assets/avatar.png";
import Img from "../../../components/lazyLoadImage/Img";

const ReviewSlider = ({ mediaType, id }) => {
  const [openReview, setOpenReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        setReviews(jsonData.results);
        setLoading(false);
      });
  }, [mediaType, id]);

  const [reviewsLength, setReviewsLength] = useState(0);

  useEffect(() => {
    if (!loading) {
      setReviewsLength(reviews.length);
    }
  }, [reviews, loading]);

  const handleCloseReview = () => {
    setOpenReview(null);
  };

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

  const LoadingSkeleton = () => (
    <Wrapper>
      <MovieRow>
        {Array.from({ length: 6 }).map((_, index) => (
          <ReviewBoxSkeleton key={index}>
            <Profile>
              <span className="loading-audience-profile"></span>
              <div className="loading-profile">
                <span className="loading-author"></span>
                <span className="loading-review-date"></span>
              </div>
            </Profile>
            <ContentReview>
              <span className="loading-review"></span>
              <span className="loading-review"></span>
              <span className="loading-review"></span>
              <span className="loading-review"></span>
              <span className="loading-review"></span>
            </ContentReview>
          </ReviewBoxSkeleton>
        ))}
      </MovieRow>
    </Wrapper>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {reviews.length === 0 ? (
        ""
      ) : (
        <Wrapper>
          <h3>Reviews</h3>
          {reviews?.length > 6 && (
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
          {!!reviews && (
            <MovieRow ref={carouselContainer}>
              {reviews.map((review) => {
                let imgUrl = review.author_details.avatar_path
                  ? "https://image.tmdb.org/t/p/original/" +
                    review.author_details.avatar_path
                  : avatar;
                return (
                  <ReviewBox key={review.id}>
                    <Profile>
                      {review.author_details.avatar_path ? (
                        <AuthorAvatar
                          src={imgUrl}
                          alt={`${review.author} avatar`}
                        />
                      ) : (
                        <AudienceRatingSvg width={50} />
                      )}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          margin: "10px",
                        }}
                      >
                        <span className="author">{review.author}</span>
                        <span className="review-date">
                          Written by <b>{review.author}</b> on{" "}
                          {dayjs(review.created_at).format("DD MMM YYYY")}
                        </span>
                      </div>
                    </Profile>
                    <RatingBadge>
                      ★ {review.author_details.rating || "N/A"}
                    </RatingBadge>
                    <ContentReview>{review.content}</ContentReview>
                    {review.content.length > 120 && (
                      <ReadMoreButton onClick={() => setOpenReview(review.id)}>
                        <ReadMoreIcon />
                        <span>Read More Detail</span>
                      </ReadMoreButton>
                    )}
                  </ReviewBox>
                );
              })}
            </MovieRow>
          )}
          {reviews && (
            <>
              {reviews.map((review) => (
                <AnimatePresence key={review.id}>
                  {openReview === review.id && (
                    <ReviewPopup open={openReview === review.id}>
                      <PopupContent open={openReview === review.id}>
                        <Profile>
                          {review.author_details.avatar_path ? (
                            <AuthorAvatar
                              src={`https://image.tmdb.org/t/p/original/${review.author_details.avatar_path}`}
                              alt={`Avatar of ${review.author}`}
                            />
                          ) : (
                            <AudienceRatingSvg width={50} />
                          )}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "10px",
                            }}
                          >
                            <span className="author">{review.author}</span>
                            <span className="review-date">
                              Written by <b>{review.author}</b> on{" "}
                              {dayjs(review.created_at).format("DD MMM YYYY")}
                            </span>
                          </div>
                        </Profile>
                        <RatingBadge>
                          ★ {review.author_details.rating || "N/A"}
                        </RatingBadge>
                        <p>{review.content}</p>
                        <div className="close-btn" onClick={handleCloseReview}>
                          <Close />
                          <span>Close</span>
                        </div>
                      </PopupContent>
                    </ReviewPopup>
                  )}
                </AnimatePresence>
              ))}
            </>
          )}
        </Wrapper>
      )}
    </>
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

const MovieRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-y: hidden;
  margin-right: -20px;
  margin-left: -20px;
  padding: 0 20px;

  @media (min-width: 768px) {
    gap: 20px;
    margin: 0;
    padding: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  position: relative;

  .carouselLeftNav {
    left: 30px;
  }

  .carouselRighttNav {
    right: 30px;
  }

  h3 {
    color: #fff;
  }
`;

const ReviewBox = styled.div`
  padding: 10px;
  border: none;
  color: #fff;
  background-color: ${(props) => props.theme.sidebarBackground};
  border-radius: 10px;
  width: 350px;
  flex-shrink: 0;
  padding-top: 10px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;

  .author {
    font-size: 14px;
  }

  .review-date {
    font-size: 11px;
  }
`;

const AuthorAvatar = styled(Img)`
  width: 65px;
  height: 65px;
  border-radius: 50%;
`;

const RatingBadge = styled.div`
  background-color: ${(props) => props.theme.navBackground};
  color: #fff;
  padding: 5px;
  font-size: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  width: 60px;
  margin: 10px 10px 0 0;
`;

const ContentReview = styled.p`
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMoreButton = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.navBackground};
  color: #fff;
  padding: 5px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  svg {
    margin-right: 5px;
  }
`;

const ReviewPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const PopupContent = styled(motion.div)`
  background-color: ${(props) => props.theme.sidebarBackground};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
  color: #fff;
  backdrop-filter: blur(5px);
  animation: ${({ open }) => (open ? "fadeIn 0.3s ease" : "fadeOut 0.3s ease")};
  transition: max-width 0.3s ease, max-height 0.3s ease;

  @keyframes fadeIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.8);
      opacity: 0;
    }
  }

  p {
    font-size: 14px;
    text-align: justify;
  }

  .close-btn {
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

    svg {
      margin-right: 5px;
    }

    &:hover {
      transform: scale(1.05);
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

const ReviewBoxSkeleton = styled.div`
  padding: 10px;
  border: none;
  color: #fff;
  background-color: ${(props) => props.theme.sidebarBackground};
  border-radius: 10px;
  width: 350px;
  cursor: pointer;
  flex-shrink: 0;
  padding-top: 10px;

  .loading-audience-profile {
    width: 40px;
    height: 48px;
    border-radius: 5px;
    background-color: rgba(200, 200, 200, 0.5);
    display: block;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }

  .loading-profile {
    height: 14px;
    width: 60%;
    margin-left: 10px;
    margin-bottom: 5px;
    border-radius: 5px;
    background-color: rgba(200, 200, 200, 0.5);
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }

  .loading-author {
    height: 14px;
    width: 60%;
    margin-bottom: 5px;
    border-radius: 5px;
    background-color: rgba(200, 200, 200, 0.5);
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }

  .loading-review-date {
    height: 11px;
    width: 40%;
    border-radius: 5px;
    background-color: rgba(200, 200, 200, 0.5);
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }

  .loading-review {
    height: 10px;
    width: 100%;
    margin-top: 10px;
    border-radius: 5px;
    background-color: rgba(200, 200, 200, 0.5);
    display: block;
    margin-bottom: 5px;
    background: linear-gradient(90deg, #2c2c2c 25%, #3a3a3a 50%, #2c2c2c 75%);
    background-size: 200% 100%;
    animation: ${skeletonAnimation} 1.5s infinite;
  }
`;

export default ReviewSlider;
