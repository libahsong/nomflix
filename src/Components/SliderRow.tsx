import styled from "styled-components";
import { AnimatePresence, useScroll, motion } from "framer-motion";
import { useQuery } from "react-query";
import { getMovies, getPopularMovies, IGetMovieResult } from "../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";

export const Slider = styled.div`
  /* position: relative; */
  box-sizing: border-box;
  margin: 3vw 0;
  /* position: absolute; */
  /* top: -110px; */
  /* min-height: 190px; */
  padding: 0 60px;
`;

export const RowHover = styled.div`
  /* padding: 0 60px; */
  /* padding: 28.5% 0; */
  /* height: 100%; */
  height: 166px;
  box-sizing: border-box;
  /* padding: 0 4%; */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 100%; */
  /* overflow-x: visible; */
`;
export const Row = styled(motion.div)<{ $movies: any }>`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 5px;
  /* grid-template-columns: repeat(${(props) => props.$movies}, 1fr); */
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  /* position: relative; */
  /* height: 170px; */
  /* z-index: 1; */
  /* box-sizing: border-box; */
`;

export const Box = styled(motion.div)<{ $bgPhoto: string }>`
  /* z-index: 0; */
  background-color: white;
  /* height: 166px; */
  /* width: 100%; */
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
  /* position: relative; */
  /* position: absolute; */
  //display: inline-block;
  //width: 330px;
  /* box-sizing: border-box; */
  /* overflow-y: hidden; */

  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    /* height: 100%; */
  }
`;

export const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  /* background-color: rgba(170, 166, 166, 0.5); */
  border-radius: 3px;
  color: #ece4e4;
  font-weight: 600;
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
  background-color: rgba(0, 0, 0, 0.5);
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
  background-color: ${(props) => props.theme.black.lighter};
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
export const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
  padding: 20px;
`;

const Prev = styled.span`
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: -60px;
  /* width: 4%; */
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
  /* width: 4%; */
  width: 60px;
  height: 100%;
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  opacity: 1;
`;

const RowMask = styled.div`
  width: 100%;
`;

const Category = styled.h2`
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
interface ITitleList {
  [key: string]: string;
}
const titleList: ITitleList = {
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
  const [front, setFront] = useState(false);
  const [remainder, setRemainder] = useState(0);
  const [change, setChange] = useState(0);
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

  const next = () => {
    if (change === 0) setChange(1);
    setBack(false);
    setFront(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      // const maxIndex = Math.floor(totalMovies / offset);
      setRemainder(totalMovies % offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      console.log("next", index, maxIndex);
    }
  };

  const prev = () => {
    setFront(false);
    setBack(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      // const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      console.log("prev", index);
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onBoxClicked = (movieId: number, title: string, category: string) => {
    if (category === "movies") {
      history.push(`/movies/${title}/${movieId}`);
    } else if (category === "tv") {
      history.push(`/tv/${title}/${movieId}`);
    }
  };

  const onOverlayClick = () => {
    if (category === "movies") return history.push("/");
    if (category === "tv") return history.push("/tv");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    bigMovieMatch?.params.title === title &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  // console.log("clickedMovie=>", clickedMovie);

  const clickedTv =
    bigTvMatch?.params.movieId &&
    bigTvMatch?.params.title === title &&
    data?.results.find((movie) => movie.id === +bigTvMatch.params.movieId);
  // console.log("clickedTv=>", clickedTv);

  let clickedContent = null;

  clickedMovie
    ? (clickedContent = clickedMovie)
    : clickedTv
    ? (clickedContent = clickedTv)
    : (clickedContent = null);
  // console.log("clickedContent=>", clickedContent);

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
                    {/* <img src={makeImagePath(movie.poster_path, "w500")} /> */}
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
      <AnimatePresence>
        {urlMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            {urlMatch?.params.title === title ? (
              <BigMovie
                layoutId={urlMatch.params.movieId + title}
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
            ) : null}
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default SliderRow;
