import { useQuery } from "react-query";
import { IGetMovieResult, getMovies, getPopularMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, delay, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import SliderRow from "../Components/SliderRow";

const Wrapper = styled.div`
  background: black;
  /* min-height: 1000px; */
  /* position: relative; */
  /* z-index: 0; */
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  /* top: -100px; */
  margin: 3vw 0;
  height: 166px;
`;

const Sliders = styled.div`
  display: grid;
  grid-template-rows: auto;
  height: 100vh;
`;

const Row = styled(motion.div)<{ $movies: any }>`
  display: grid;
  gap: 5px;
  /* grid-template-columns: repeat(${(props) => props.$movies}, 1fr); */
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  /* height: 170px; */
`;
const RowHover = styled.div`
  /* padding: 0 60px; */
  height: 100%;
  width: 100%;
  /* overflow-x: visible; */
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  height: 166px;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  border-radius: 5px;
  position: relative;
  /* display: inline-block;
  width: 330px; */
`;

const Info = styled(motion.div)`
  padding: 10px;
  /* background-color: ${(props) => props.theme.black.lighter}; */
  /* opacity: 0; */
  background-color: rgba(170, 166, 166, 0.5);
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
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
  left: 0;
  height: 100%;
  width: 60px;
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20;
  opacity: 1;
`;
const Next = styled.span`
  cursor: pointer;
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 100%;
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  // z-index: 20;
`;

const RowMask = styled.div`
  width: 100%;
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
    y: -50,
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
const headerTitle = "";

function Home() {
  const { data, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data);

  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetMovieResult>(["popularMovies", "popular"], getPopularMovies);
  // console.log(popularData);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const [front, setFront] = useState(false);
  const [remainder, setRemainder] = useState(0);
  const [change, setChange] = useState(0);
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
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
      console.log("next", index);
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
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  // console.log(clickedMovie);
  const clickedPopular = bigMovieMatch?.params.movieId;
  // console.log(clickedPopular);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <h2>Now Playing</h2>
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
                  key={index}
                >
                  {data?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        key={movie.id}
                        layoutId={movie.id + ""}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        onClick={() => onBoxClicked(movie.id)}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
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
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  ) : null}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
