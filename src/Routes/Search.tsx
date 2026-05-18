/* eslint-disable @typescript-eslint/no-unused-vars */

import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { getSearchMovie, getSearchTv, IGetMovieResult } from "../api";
import { useEffect, useState } from "react";
import { useScroll } from "framer-motion";
import styled from "styled-components";
import SearchRow from "../Components/SearchRow";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, paramIdState } from "../atoms";
import SearchOverlay from "../Components/SearchOverlay";
import TvSearchOverlay from "../Components/TvSearchOverlay";

const Wrapper = styled.div`
  background: black;
  position: relative;
  z-index: 0;
  padding: 0 0 50px;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const Keywords = styled.div`
  line-height: 1.6;
  display: flex;
  width: 100%;
  font-size: 1.5vw;
  span {
    color: rgb(128, 128, 128);
    flex: 0 1 auto;
    margin-right: 5px;
    white-space: nowrap;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0px;
    padding: 0px;
    li {
      flex: 0 1 auto;
      border-right: 1px solid rgb(128, 128, 128);
      list-style: none;
      padding: 0px 0.5em;
      font-weight: 530;
      font-size: calc(1.125vw);
    }
  }
`;

const SearchRowContainer = styled.div`
  padding-top: 4%;
  margin-top: 1em;
  padding-left: 60px;
  padding-right: 60px;
`;

function Search() {
  const location = useLocation();

  const keyword = new URLSearchParams(location.search).get("keyword");
  const id = new URLSearchParams(location.search).get("movieId");
  const setQueryId = useSetRecoilState(paramIdState);

  const category = useRecoilValue(categoryState);
  const [newKeyword, setNewKeyword] = useState<string | null>();
  useEffect(() => {
    setQueryId(id ? +id : 0);
    setNewKeyword(keyword);
  }, [keyword, id, setQueryId]);

  const useMultipleQuery = () => {
    const movies = useQuery<IGetMovieResult>(["searchMovies", keyword], () =>
      getSearchMovie(keyword as any),
    );
    const tvShows = useQuery<IGetMovieResult>(["searchTvShows", keyword], () =>
      getSearchTv(keyword as any),
    );
    return [movies, tvShows];
  };

  const [
    { data: searchMovies, isLoading: searchingMovies },
    { data: searchTvShows, isLoading: searchingTvShows },
  ] = useMultipleQuery();

  const clickedContent =
    id && searchMovies && category === "movies"
      ? searchMovies.results.find((movie) => movie.id === +id)
      : id && searchTvShows
        ? searchTvShows.results.find((movie) => movie.id === +id)
        : null;

  const history = useHistory();
  const onOverlayClick = () => {
    history.push(`/search?keyword=${keyword}`);
  };
  const { scrollY } = useScroll();

  return (
    <>
      <Wrapper>
        <SearchRowContainer>
          <Keywords>
            <span>더 많은 검색어: </span>
            <ul>
              {searchMovies?.results.map((movie) => (
                <li key={movie.id}>{movie.title}</li>
              ))}
            </ul>
          </Keywords>
          {searchMovies && keyword === newKeyword ? (
            <SearchRow
              keyword={keyword}
              data={searchMovies}
              category="movies"
              key="movies"
            />
          ) : null}
          {searchTvShows && keyword === newKeyword ? (
            <SearchRow
              keyword={keyword}
              data={searchTvShows}
              category="tvShows"
              key="tvShows"
            />
          ) : null}
        </SearchRowContainer>
        {id && keyword && category === "movies" && clickedContent ? (
          <SearchOverlay
            keyword={keyword}
            id={id}
            scrollY={scrollY}
            clickedContent={clickedContent}
          />
        ) : id && keyword && category === "tvShows" && clickedContent ? (
          <TvSearchOverlay
            keyword={keyword}
            id={id}
            scrollY={scrollY}
            clickedContent={clickedContent}
          />
        ) : null}
      </Wrapper>
    </>
  );
}
export default Search;
