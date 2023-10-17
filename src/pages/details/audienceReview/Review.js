import React, { useState } from "react";
import { styled, keyframes } from "styled-components";
import useFetch from "../../../hooks/useFetch";
import { ArrowBackIos, ArrowForwardIos, Close } from "@material-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import AudienceRatingSvg from "./AudienceRatingSvg";
import dayjs from "dayjs";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { motion, AnimatePresence } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";

const Review = ({ mediaType, id }) => {
  const { data: reviews, loading: reviewsLoading } = useFetch(
    `/${mediaType}/${id}/reviews`
  );
  const [openReview, setOpenReview] = useState(false);

  const handleOpenReview = (reviewId) => {
    setOpenReview(reviewId);
  };

  const handleCloseReview = () => {
    setOpenReview(null);
  };

  const LoadingSkeleton = () => (
    <Wrapper>
      <h3>Reviews</h3>
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

  if (reviewsLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Wrapper>
      <h3>Reviews</h3>
      {!!reviews ? (
        <MovieRow>
          {reviews.length === 0 ? (
            <h1>No Review Available</h1>
          ) : (
            <>
              {reviews.results.map((review) => (
                <>
                  <ReviewBox key={review.id}>
                    <Profile>
                      {review.author_details.avatar_path ? (
                        <AuthorAvatar
                          src={`https://image.tmdb.org/t/p/w64_and_h64_face${review.author_details.avatar_path}`}
                          alt={`Avatar of ${review.author}`}
                        />
                      ) : (
                        <AudienceRatingSvg width={40} />
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
                    {openReview === review.id && (
                      <AnimatePresence>
                        <ReviewPopup open={openReview === review.id}>
                          <PopupContent open={openReview === review.id}>
                            <Profile>
                              {review.author_details.avatar_path ? (
                                <AuthorAvatar
                                  src={`https://image.tmdb.org/t/p/w64_and_h64_face/${review.author_details.avatar_path}`}
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
                                  {dayjs(review.created_at).format(
                                    "DD MMM YYYY"
                                  )}
                                </span>
                              </div>
                            </Profile>
                            <RatingBadge>
                              ★ {review.author_details.rating || "N/A"}
                            </RatingBadge>
                            <p>{review.content}</p>
                            <div
                              className="close-btn"
                              onClick={handleCloseReview}
                            >
                              <Close />
                              <span>Close</span>
                            </div>
                          </PopupContent>
                        </ReviewPopup>
                      </AnimatePresence>
                    )}
                  </ReviewBox>
                </>
              ))}
            </>
          )}
        </MovieRow>
      ) : (
        <h1>No Review Available</h1>
      )}
    </Wrapper>
  );
};

const Arrows = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: flex-end;

  svg {
    margin: 10px;
    color: rgba(255, 255, 255, 0.5);

    &:hover {
      color: #fff;
    }
  }
`;

const MovieRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
`;

const ReviewBox = styled.div`
  padding: 10px;
  border: none;
  color: #fff;
  background-color: ${(props) => props.theme.sidebarBackground};
  height: 100%;
  width: 100%;
  border-radius: 10px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;

  .author {
    font-size: 13px;
  }

  .review-date {
    font-size: 11px;
  }
`;

const AuthorAvatar = styled.img`
  width: 50px;
  height: 50px;
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
  z-index: 998;
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
  animation: ${({ open }) => (open ? "fadeIn 0.3s ease" : "fadeOut 0.3s ease")};
  transition: max-width 0.3s ease, max-height 0.3s ease;
  backdrop-filter: blur(5px);

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
  height: auto;
  width: 90%;
  border-radius: 10px;

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

export default Review;
