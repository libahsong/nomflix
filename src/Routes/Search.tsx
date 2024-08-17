import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { getSearchMovie, getSearchTv, IGetMovieResult } from "../api";
import { useState } from "react";
import {
  BigCover,
  BigMovie,
  BigOverview,
  BigTitle,
  Info,
  Overlay,
  // Row,
  RowHover,
  Slider,
} from "../Components/SliderRow";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import styled from "styled-components";

const Wrapper = styled.div`
  background: black;
  /* overflow-x: hidden; */
  /* overflow-y: hidden; */
  /* width: 100%; */
  min-height: 1000px;
  position: relative;
  z-index: 0;
  /* display: flex; */
  /* align-items: center; */
  /* flex-direction: column; */
  /* box-sizing: border-box; */
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Sliders = styled.div`
  position: absolute;
  top: 80vh;
  width: 100%;
  overflow-x: hidden;
  /* position: relative; //BigMovie card scrollY().get+100 is going to be related to Sliders scrollY */
  /* display: grid; */
  /* grid-template-rows: auto; */
  /* height: 100vh; */
`;

const Keywords = styled.div`
  line-height: 1.6;
  display: flex;
  /* display: inline-block; */
  min-height: 65px;
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
  /* width: 100vw; */
  /* display: inline-block; */

  padding-top: 4%;
  margin-top: 1em;
  box-sizing: border-box;
  padding-left: 60px;
  padding-right: 60px;
  /* overflow-x: hidden; */
`;

const SearchRow = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 4vw 0px;
  grid-template-columns: repeat(6, 1fr);
  /* position: absolute; */
  overflow: hidden;
  line-height: 1.6;
  margin-top: 10px;
  /* position: relative; */
  /* height: 170px; */
  /* z-index: 1; */
  /* box-sizing: border-box; */
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  /* z-index: 0; */
  background-color: white;
  /* height: 166px; */
  position: relative;
  width: 100%;
  height: 0;
  padding: 28.125% 0;
  /* padding: 0px 0.2vw; */
  /* height: 100%; */
  /* padding: 28.5% 0; */
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  /* background-size: contain; */
  background-repeat: no-repeat;
  background-position: center;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  border-radius: 5px;
  /* position: absolute; */
  //display: inline-block;
  //width: 330px;
  /* box-sizing: border-box; */
  /* overflow-y: hidden; */

  img {
    width: 100%;
    position: absolute;
    object-fit: fill;
    /* height: 100%; */
  }
`;

const BoxMask = styled.div`
  padding: 0px 0.2vw;
`;

const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    // zIndex: 2,
    // y: -50,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};

const offset = 6;

function Search() {
  const category = "movies";
  const location = useLocation();
  console.log("location", location);

  const keyword = new URLSearchParams(location.search).get("keyword");
  const id = new URLSearchParams(location.search).get("movieId");

  console.log("keyword", keyword);
  const [movies, setMovies] = useState<IGetMovieResult>();

  const { data: searchMovies, isLoading: searchingMovies } =
    useQuery<IGetMovieResult>(["searchMovies", keyword], () =>
      getSearchMovie(keyword as any)
    );
  console.log("searchMovies", searchMovies);

  const { data: searchTvShows, isLoading: searchingTvShows } =
    useQuery<IGetMovieResult>(["searchTvShows", keyword], () =>
      getSearchTv(keyword as any)
    );
  // console.log("searchTvShows", searchTvShows);

  const data = searchMovies;
  const history = useHistory();

  // const bigMovieMatch = useRouteMatch<{ movieId: string; title: string }>(
  //   "/movies/:title/:movieId"
  // );
  // const bigTvMatch = useRouteMatch<{ movieId: string; title: string }>(
  //   "/tv/:title/:movieId"
  // );
  const urlMatch = useRouteMatch<{ movieId: string; keyword: string }>(
    `/search/:q/:movieId`
  );

  console.log("urlMatch", urlMatch);

  // let urlMatch = null;
  // bigMovieMatch
  //   ? (urlMatch = bigMovieMatch)
  //   : bigTvMatch
  //   ? (urlMatch = bigTvMatch)
  //   : (urlMatch = null);

  const onBoxClicked = (movieId: number, keyword: string, category: string) => {
    // if (category === "movies") {
    //   history.push(`/movies/${title}/${movieId}`);
    // } else if (category === "tv") {
    //   history.push(`/tv/${title}/${movieId}`);
    // }
    // history.push(`/search/${keyword}/${movieId}`);
    history.push(`/search?keyword=${keyword}&movieId=${movieId}`);
  };

  const onOverlayClick = () => {
    // if (category === "movies") return history.push("/");
    // if (category === "tv") return history.push("/tv");
    history.push(`/search?keyword=${keyword}`);
  };

  // const clickedMovie =
  // urlMatch?.params.movieId &&
  //   bigMovieMatch?.params.title === title &&
  //   data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  // const clickedTv =
  //   bigTvMatch?.params.movieId &&
  //   bigTvMatch?.params.title === title &&
  //   data?.results.find((movie) => movie.id === +bigTvMatch.params.movieId);

  const clickedContent =
    // urlMatch?.params.movieId &&
    id &&
    // data?.results.find((movie) => movie.id === +urlMatch.params.movieId);
    data?.results.find((movie) => movie.id === +id);

  // let clickedContent = null;

  // clickedMovie
  //   ? (clickedContent = clickedMovie)
  //   : clickedTv
  //   ? (clickedContent = clickedTv)
  //   : (clickedContent = null);
  // console.log("clickedContent=>", clickedContent);

  const { scrollY } = useScroll();

  return (
    <>
      <Wrapper>
        {/* <AnimatePresence> */}

        <SearchRowContainer>
          <Keywords>
            <span>더 많은 검색어: </span>
            <ul>
              {data?.results.map((movie) => (
                <li>{movie.title + "  |  "}</li>
              ))}
            </ul>
          </Keywords>
          <SearchRow
            key={keyword}
            // id={index + ""}
          >
            {data?.results
              // .slice(1)
              // .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <BoxMask>
                  <Box
                    key={movie.id}
                    layoutId={movie.id + ""}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    // $bgPhoto={makeImagePath(movie.poster_path, "w500")}
                    onClick={() =>
                      onBoxClicked(movie.id, keyword as any, category)
                    }
                  >
                    {/* <img src={makeImagePath(movie.poster_path, "w500")} /> */}
                    <Info variants={infoVariants}>
                      <h4>
                        {category === "movies" ? movie.title : movie.name}
                      </h4>
                    </Info>
                  </Box>
                </BoxMask>
              ))}
          </SearchRow>
        </SearchRowContainer>

        {/* </AnimatePresence> */}
        <AnimatePresence>
          {id ? (
            <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <BigMovie
                // layoutId={urlMatch.params.movieId}
                layoutId={id}
                style={{ top: scrollY.get() + 100 }}
              >
                {clickedContent ? (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                          clickedContent.backdrop_path,
                          "w500"
                        )})`,
                      }}
                    />
                    <BigTitle>
                      {category === "movies"
                        ? clickedContent.title
                        : clickedContent.name}
                    </BigTitle>
                    <BigOverview>{clickedContent.overview}</BigOverview>
                  </>
                ) : null}
              </BigMovie>
            </>
          ) : null}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}
export default Search;
