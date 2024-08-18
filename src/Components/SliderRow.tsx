import React, { useEffect } from "react";
import styled from "styled-components";
import { AnimatePresence, useScroll, motion } from "framer-motion";
import { useQuery } from "react-query";
import { IGetMovieResult } from "../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";
import { useRecoilState } from "recoil";
import { paramIdState } from "../atoms";
import MovieOverlay from "./MovieOverlay";
import TvOverlay from "./TvOverlay";

export const Slider = styled.div`
  margin: 3vw 0;
  padding: 0 60px;
  z-index: 1;
`;

export const RowHover = styled.div`
  height: 166px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Row = styled(motion.div)<{ $movies: any }>`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  z-index: 1;
`;

export const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
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
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
`;

export const Buttons = styled.div`
  width: 10px;
`;
export const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  border-radius: 3px;
  color: #ece4e4;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  z-index: 2;
`;

export const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.veryDark};
  border-radius: 15px;
  overflow: hidden;
  z-index: 4;
`;

export const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;
export const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

export const BigContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  width: 90%;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

export const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
  padding: 20px;
  font-weight: 350;
  span {
    margin-right: 10px;
  }
`;

export const BigMovieInfo = styled.ul`
  span {
    color: grey;
  }
  font-weight: 350;
  /* color: white; */
`;

const Prev = styled.span`
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: -60px;
  width: 60px;
  height: 100%;
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  opacity: 1;
`;
const Next = styled.span`
  cursor: pointer;
  position: absolute;
  right: -60px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 100%;
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  opacity: 1;
`;

export const Category = styled.h2`
  margin-bottom: 10px;
  font-size: 30px;
  font-weight: 580;
`;

const Pagination = styled(motion.ul)<{ $page: number }>`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  li {
    width: 2vw;
    height: 0.2vh;
    background-color: ${(props) => props.theme.black.lighter};
    margin-right: 1px;
  }
  li:nth-child(${(props) => props.$page + 1}) {
    background-color: ${(props) => props.theme.white.lighter};
  }
`;

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.2,
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
interface ITitleList {
  [key: string]: string;
}
export const titleList: ITitleList = {
  movies: "Movie List",
  tvShows: "TV Show List",
  now: "Now Playing Movies",
  popular: "Popular Movies",
  top: "Top Rated Movies",
  upcoming: "Upcoming Movies",
  airingToday: "Airing Today TV Shows",
  onTheAir: "On the Air TV Shows",
  popularTv: "Popular TV Shows",
  topTv: "Top Rated TV Shows",
};

function SliderRow(props: {
  category: string;
  title: string;
  data: IGetMovieResult;
}) {
  const { data, title, category } = props;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const [change, setChange] = useState(0);
  const [queryId, setQueryId] = useRecoilState(paramIdState);

  const history = useHistory();

  const bigMovieMatch = useRouteMatch<{ movieId: string; title: string }>(
    "/movies/:title/:movieId"
  );
  const bigTvMatch = useRouteMatch<{ movieId: string; title: string }>(
    "/tv/:title/:movieId"
  );

  let urlMatch = null;
  bigMovieMatch
    ? (urlMatch = bigMovieMatch)
    : bigTvMatch
    ? (urlMatch = bigTvMatch)
    : (urlMatch = null);

  console.log("urlMatch=>", urlMatch);

  const { scrollY } = useScroll();
  console.log("SliderRow", scrollY.get());

  const next = () => {
    if (change === 0) setChange(1);
    setBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      console.log("next", index, maxIndex);
    }
  };

  const prev = () => {
    setBack(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      console.log("prev", index);
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onBoxClicked = (movieId: number, title: string, category: string) => {
    if (category === "movies") {
      setQueryId(+movieId);
      history.push(`/movies/${title}/${movieId}`);
    } else if (category === "tv") {
      setQueryId(+movieId);
      history.push(`/tv/${title}/${movieId}`);
    }
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    bigMovieMatch?.params.title === title &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  const clickedTv =
    bigTvMatch?.params.movieId &&
    bigTvMatch?.params.title === title &&
    data?.results.find((movie) => movie.id === +bigTvMatch.params.movieId);

  let clickedContent = null;

  clickedMovie
    ? (clickedContent = clickedMovie)
    : clickedTv
    ? (clickedContent = clickedTv)
    : (clickedContent = null);

  return (
    <>
      <Slider>
        <Category>{titleList[title]}</Category>
        <Pagination $page={index}>
          {(() => {
            const TOTAL = Math.floor(data?.results.length / offset);
            let arr = [];
            for (let i = 0; i < TOTAL; i++) {
              arr.push(<li key={i}></li>);
            }
            return arr;
          })()}
        </Pagination>
        <RowHover>
          <Prev onClick={prev}>
            <b>&#10094;</b>
          </Prev>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              $movies={data?.results.length}
              custom={back}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index + title}
              id={index + ""}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    key={movie.id + title}
                    layoutId={movie.id + title}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    // $bgPhoto={makeImagePath(movie.poster_path, "w500")}
                    onClick={() => onBoxClicked(movie.id, title, category)}
                  >
                    <Info variants={infoVariants}>
                      <h4>
                        {category === "movies" ? movie.title : movie.name}
                      </h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
          <Next onClick={next}>
            <b>&#10095;</b>
          </Next>
        </RowHover>
      </Slider>
      {urlMatch && category === "movies" && queryId !== 0 ? (
        <MovieOverlay
          urlMatch={urlMatch}
          title={title}
          scrollY={scrollY}
          clickedContent={clickedContent}
          category={category}
        />
      ) : urlMatch && queryId !== 0 ? (
        <TvOverlay
          urlMatch={urlMatch}
          title={title}
          scrollY={scrollY}
          clickedContent={clickedContent}
          category={category}
        />
      ) : null}
    </>
  );
}

export default SliderRow;
