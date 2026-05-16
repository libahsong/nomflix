import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { getSearchMovie, getSearchTv, IGetMovieResult } from "../api";
import { useEffect, useState } from "react";
import {
  BigCover,
  BigMovie,
  BigOverview,
  BigTitle,
  Overlay,
} from "../Components/SliderRow";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import SearchRow from "../Components/SearchRow";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, paramIdState } from "../atoms";
import SearchOverlay from "../Components/SearchOverlay";
import MovieOverlay from "../Components/MovieOverlay";
import TvSearchOverlay from "../Components/TvSearchOverlay";

const Wrapper = styled.div`
  background: black;
  /* min-height: 1000px; */
  position: relative;
  z-index: 0;
  padding: 0 0 50px;

  overflow-x: hidden;
  overflow-y: hidden;
`;

const Keywords = styled.div`
  line-height: 1.6;
  display: flex;
  /* display: inline-block; */
  /* min-height: 65px; */
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
  /* box-sizing: border-box; */
  padding-left: 60px;
  padding-right: 60px;
`;

function Search() {
  const location = useLocation();

  const keyword = new URLSearchParams(location.search).get("keyword");
  const id = new URLSearchParams(location.search).get("movieId");
  // const [queryId, setQueryId] = useRecoilState(paramIdState);
  const setQueryId = useSetRecoilState(paramIdState);

  // setQueryId(id ? +id : 0);
  const category = useRecoilValue(categoryState);
  // console.log("category", category);

  // console.log("typof id", typeof id, id);

  // console.log("keyword", keyword);
  const [newKeyword, setNewKeyword] = useState<string | null>();
  useEffect(() => {
    setQueryId(id ? +id : 0);
    // console.log("useEffect keyword", keyword);
    // console.log("useEffect newkeyword", newKeyword);
    // console.log("category", category);

    setNewKeyword(keyword);
  }, [keyword]);

  // console.log("rerendering keyword", keyword);
  // console.log("rerendering newkeyword", newKeyword);

  const useMultipleQuery = () => {
    const movies = useQuery<IGetMovieResult>(["searchMovies", keyword], () =>
      getSearchMovie(keyword as any)
    );
    const tvShows = useQuery<IGetMovieResult>(["searchTvShows", keyword], () =>
      getSearchTv(keyword as any)
    );
    return [movies, tvShows];
  };

  const [
    { data: searchMovies, isLoading: searchingMovies },
    { data: searchTvShows, isLoading: searchingTvShows },
  ] = useMultipleQuery();

  // console.log("searchTvShows", searchTvShows);
  // console.log("searchMovies", searchMovies);

  // const urlMatch = useRouteMatch<{ movieId: string; keyword: string }>(
  //   `/search/:q/:movieId`
  // );

  // console.log("urlMatch", urlMatch);

  const clickedContent =
    id && searchMovies && category === "movies"
      ? searchMovies.results.find((movie) => movie.id === +id)
      : id && searchTvShows
      ? searchTvShows.results.find((movie) => movie.id === +id)
      : null;

  // console.log(
  //   "TVclickedContent",
  //   id ? searchTvShows?.results.find((movie) => movie.id === +id) : "no Id",
  //   clickedContent
  // );

  // console.log(
  //   "MOVIEclickedContent",
  //   id ? searchMovies?.results.find((movie) => movie.id === +id) : "no Id",
  //   clickedContent
  // );

  const history = useHistory();
  const onOverlayClick = () => {
    // if (category === "movies") return history.push("/");
    // if (category === "tv") return history.push("/tv");
    history.push(`/search?keyword=${keyword}`);
  };
  const { scrollY } = useScroll();
  // console.log("scrollY.get()", scrollY.get());

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
        {/* {keyword && id && clickedContent ? (
          <BigCardOverlay keyword={keyword} id={id} content={clickedContent} />
        ) : null} */}
        {/* <AnimatePresence> */}
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
        {/* </AnimatePresence> */}
      </Wrapper>
    </>
  );
}
export default Search;
