import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import styled from "styled-components";

let filters = {};

const sortbyData = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
  {
    value: "primary_release_date.desc",
    label: "Release Date Descending",
  },
  { value: "primary_release_date.asc", label: "Release Date Ascending" },
  { value: "original_title.asc", label: "Title (A-Z)" },
];

const Explore = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState(null);
  const [sortby, setSortby] = useState(null);
  const { mediaType } = useParams();

  const { data: genresData } = useFetch(`/genre/${mediaType}/list`);

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/discover/${mediaType}`, filters).then((res) => {
      setData(res);
      setPageNum((prev) => prev + 1);
      setLoading(false);
    });
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/discover/${mediaType}?page=${pageNum}`, filters).then(
      (res) => {
        if (data?.results) {
          setData({
            ...data,
            results: [...data?.results, ...res.results],
          });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  useEffect(() => {
    filters = {};
    setData(null);
    setPageNum(1);
    setSortby(null);
    setGenre(null);
    fetchInitialData();
  }, [mediaType]);

  const onChange = (selectedItems, action) => {
    if (action.name === "sortby") {
      setSortby(selectedItems);
      if (action.action !== "clear") {
        filters.sort_by = selectedItems.value;
      } else {
        delete filters.sort_by;
      }
    }

    if (action.name === "genres") {
      setGenre(selectedItems);
      if (action.action !== "clear") {
        let genreId = selectedItems.map((g) => g.id);
        genreId = JSON.stringify(genreId).slice(1, -1);
        filters.with_genres = genreId;
      } else {
        delete filters.with_genres;
      }
    }

    setPageNum(1);
    fetchInitialData();
  };

  return (
    <ExplorePage>
      <PageHeader>
        <PageTitle>
          {mediaType === "tv" ? "Explore TV Shows" : "Explore Movies"}
        </PageTitle>
        <Filters>
          <StyledSelect
            isMulti
            name="genres"
            value={genre}
            closeMenuOnSelect={false}
            options={genresData?.genres}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            onChange={onChange}
            placeholder="Select genres"
            className="genresDD"
            classNamePrefix="react-select"
          />
          <StyledSelect
            name="sortby"
            value={sortby}
            options={sortbyData}
            onChange={onChange}
            isClearable={true}
            placeholder="Sort by"
            className="sortbyDD"
            classNamePrefix="react-select"
          />
        </Filters>
      </PageHeader>
      {loading && <Spinner initial={true} />}
      {!loading && (
        <>
          {data?.results?.length > 0 ? (
            <InfiniteScroll
              className="content"
              dataLength={data?.results?.length || []}
              next={fetchNextPageData}
              hasMore={pageNum <= data?.total_pages}
              loader={<Spinner />}
            >
              {data?.results?.map((item, index) => {
                if (item.media_type === "person") return null;
                return (
                  <MovieCard key={index}>
                    <MovieCard key={index} data={item} mediaType={mediaType} />
                  </MovieCard>
                );
              })}
            </InfiniteScroll>
          ) : (
            <ResultNotFound>Sorry, Results not found!</ResultNotFound>
          )}
        </>
      )}
    </ExplorePage>
  );
};

const ExplorePage = styled.div`
  min-height: 700px;
  padding-top: 100px;
`;

const ResultNotFound = styled.span`
  font-size: 24px;
  color: ${(props) => props.theme.textColor};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const PageTitle = styled.div`
  font-size: 24px;
  line-height: 34px;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const StyledSelect = styled(Select)`
  &.genresDD {
    width: 100%;

    @media (min-width: 768px) {
      max-width: 500px;
      min-width: 250px;
    }
  }

  &.sortbyDD {
    width: 100%;
    flex-shrink: 0;

    @media (min-width: 768px) {
      width: 250px;
    }
  }

  .react-select__control {
    border: 0;
    outline: 0;
    box-shadow: none;
    background-color: ${(props) => props.theme.navBackground};
    border-radius: 20px;

    .react-select__value-container {
      .react-select__placeholder,
      .react-select__input-container {
        color: ${(props) => props.theme.textColor};
        margin: 0 10px;
      }
    }

    .react-select__single-value {
      color: ${(props) => props.theme.titleColor};
    }

    .react-select__multi-value {
      background-color: #000;
      border-radius: 10px;

      .react-select__multi-value__label {
        color: ${(props) => props.theme.textColor};
      }

      .react-select__multi-value__remove {
        background-color: transparent;
        color: ${(props) => props.theme.textColor};
        cursor: pointer;

        &:hover {
          color: #c0c0c0;
        }
      }
    }
  }

  .react-select__menu {
    background-color: ${(props) => props.theme.inputBackground};
    top: 40px;
    margin: 0;
    padding: 0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  margin-bottom: 50px;

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

const MovieCardContainer = styled.div`
  .posterBlock {
    margin-bottom: 30px;
  }
`;

export default Explore;
