import styled from "styled-components";
import { AnimatePresence, useScroll, motion } from "framer-motion";
import { IGetMovieResult, IMovie } from "../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";
import { useRecoilState } from "recoil";
import { hoverState, overlayClickedState, paramIdState } from "../atoms";
import MovieOverlay from "./MovieOverlay";
import TvOverlay from "./TvOverlay";
import { MovieHoveringInfo } from "./MovieHoveringInfo";
import { TVHoveringInfo } from "./TVHoveringInfo copy";

export const Sliders = styled(motion.div)``;

export const Slider = styled(motion.div)`
  width: 100%;
  margin: 3vw 0;
  padding: 0 4%;
  box-sizing: border-box;
  height: 9vw;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RowHover = styled(motion.div)`
  width: 100%;
  position: relative;
  box-sizing: border-box;
`;

export const Row = styled(motion.div)<{ $movies: any }>`
  width: 92%;
  box-sizing: border-box;
  height: 100%;
  display: grid;
  gap: 0.4%;
  grid-template-columns: repeat(6, calc(98% / 6));
  position: absolute;
`;

export const BoxMask = styled(motion.div)<{ $bgPhoto: string | null }>`
  box-sizing: border-box;
  height: 9vw;
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: 100% 9vw;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 3px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

export const Box = styled(motion.div)<{ $bgPhoto: string | null }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  display: flex;
  align-items: end;
  padding: 0;
  width: calc(98% / 6);
  height: 100%;
  font-size: 66px;
  cursor: pointer;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: transparent;
  /* background-image: url(${(props) => props.$bgPhoto}); */
  /* background-size: 100% 9vw; */
  background-repeat: no-repeat;
  background-position: center;
  /* background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.8)
    ),
    url(${(props) => props.$bgPhoto}); */
  /* &:first-child {
    transform-origin: 0% 0%;
  }
  &:last-child {
    transform-origin: 100% 0%;
  } */
  /* transform-origin: "left"; */
  /* img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    object-fit: fill;
    object-position: center;
    background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    );
  } */
`;

export const Buttons = styled.div`
  width: 10px;
  height: 100%;
`;
export const Info = styled(motion.div)`
  /* position: absolute; */
  /* z-index: 1; */
  /* margin: 0 auto; */
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* height: 100%; */
  opacity: 1;
  /* border-radius: 3px; */
  color: #ece4e4;
  h4 {
    text-align: center;
    font-size: 1.2vw;
    opacity: 1;
    font-weight: 500;
    /* position: absolute; */
    /* bottom: 0; */
  }
`;

// export const HoveringInfo = styled(motion.div)`
//   /* z-index: 10; */
//   visibility: hidden;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   /* position: relative; */
//   width: 100%;
//   opacity: 0;
//   /* top: -1px; */
//   border-radius: 0 0 3px 3px;
//   color: #ece4e4;
//   background-color: ${(props) => props.theme.black.darker};
//   h4 {
//     text-align: center;
//     font-size: 1.2vw;
//     opacity: 1;
//     font-weight: 500;
//     /* position: absolute; */
//     /* bottom: 0; */
//   }
// `;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  /* background-color: rgba(0, 0, 0, 1); */
  opacity: 0;
  z-index: 11;
`;

export const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  min-height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 15px;
  overflow: hidden;
  z-index: 12;
`;

export const BigMovieGradient = styled(motion.div)`
  /* position: relative; */
  height: 100%;
  background: linear-gradient(
    rgb(24, 24, 24, 0) 40%,
    rgb(24, 24, 24, 0.5),
    rgb(24, 24, 24, 0.85),
    rgb(24, 24, 24, 1),
    rgb(24, 24, 24, 1),
    rgb(24, 24, 24, 1),
    rgb(24, 24, 24, 1)
  );
`;

export const BigCover = styled.div<{ $bgPhoto: string | null }>`
  display: flex;
  align-items: end;
  position: relative;
  z-index: -1;
  width: 100%;
  height: 23vw;
  background-image: url(${(props) => props.$bgPhoto});
  background:
    linear-gradient(
      rgba(24, 24, 24, 0),
      rgba(24, 24, 24, 0),
      rgba(24, 24, 24, 1)
    ),
    url(${(props) => props.$bgPhoto});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`;
export const BigTitle = styled.div`
  padding: 2vw;
  position: relative;
  z-index: 3;
  /* position: absolute; */
  /* position: relative; */
  /* top: -11vw; */
  /* top: -8vw; */

  h2 {
    color: ${(props) => props.theme.white.lighter};
    font-size: 3.5vw;
    font-weight: 600;
    margin-bottom: 1vw;
  }
`;

export const BigTitleIcons = styled.div`
  display: flex;
`;

export const BigContainer = styled.div`
  background: linear-gradient(rgba(24, 24, 24, 1), rgba(24, 24, 24, 0));
  font-size: 0.9vw;
  display: flex;
  /* width: 90%; */
  position: relative;
  top: -0.05vw;
  padding: 0 2vw 2vw 2vw;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;

  /* margin: 0 auto; */
  /* padding: 0 2vw; */
`;

export const BigOverview = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  /* top: -80px; */
  /* padding: 20px; */
  font-weight: 350;
  span {
    margin-right: 10px;
  }
  margin-right: 1vw;
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
  left: 0;
  width: 4%;
  height: 100%;
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  opacity: 1;
`;
const Next = styled.span`
  cursor: pointer;
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4%;
  height: 100%;
  font-size: 28px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  opacity: 1;
`;

export const Category = styled.h2`
  /* margin-bottom: 5px; */
  font-size: 1.4vw;
  font-weight: 500;
  margin: 0 4% 0.5em;
  min-width: 6em;
`;

export const InfoContainer = styled(motion.div)`
  opacity: 0;
  /* box-sizing: border-box; */
  /* width: 100%; */
  /* z-index: 10; */
  padding: 1vw;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* position: relative; */
  width: 100%;
  /* top: -1px; */
  border-radius: 0 0 3px 3px;
  color: #ece4e4;
  background-color: ${(props) => props.theme.black.darker};
  h4 {
    text-align: center;
    font-size: 1.2vw;
    opacity: 1;
    font-weight: 500;
    /* position: absolute; */
    /* bottom: 0; */
  }
  position: relative;
  top: -1px;
  cursor: pointer;
`;

export const IconsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7vw;
`;

export const Icons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.2vw;
`;

export const PlayIcon = styled.svg`
  width: 2vw;
  height: 2vw;
  fill: white;
  cursor: pointer;
`;

export const AddIcon = styled(motion.div)`
  &:hover {
    border: 1.2px solid ${(props) => props.theme.white.lighter} !important;
    background-color: ${(props) => props.theme.black.lighter};
  }
  cursor: pointer;
  width: 2vw;
  height: 2vw;
  border: 1.2px solid ${(props) => props.theme.black.lighter} !important;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 1vw;
    height: 1vw;
    fill: white;
  }
`;

export const ThumbIcon = styled(AddIcon)`
  /* cursor: pointer;
  width: 2vw;
  height: 2vw;
  border: 1px solid white;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 1vw;
    height: 1vw;
    fill: white;
  } */
`;

export const OpenIcon = styled(AddIcon)`
  /* cursor: pointer;
  width: 2vw;
  height: 2vw;
  border: 1px solid white;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 1vw;
    height: 1vw;
    fill: white;
  } */
`;

const ReleaseInfo = styled.div``;
const RatingIcon = styled.div``;
const Season = styled.div``;
const HD = styled.div``;
const Genres = styled.div``;

const RankIcon = styled.svg``;

const Pagination = styled(motion.ul)<{ $page: number }>`
  list-style-type: none;
  margin: -24px 0 12px;
  padding: 0;
  position: absolute;
  right: 4%;
  top: 0;

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
  hidden: (isBack: boolean) => {
    return {
      x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
      // x: isBack ? -1000 : 1000,
      opacity: 1,
    };
    // transition: { type: "tween", duration: 1 },
  },

  visible: {
    // zIndex: 4,
    x: 0,
    opacity: 1,
  },
  exit: (isBack: boolean) => {
    return {
      zIndex: 0,
      x: !isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
      // x: !isBack ? -2000 : 2000,
      opacity: 1,
    };
  },
  // prev: (isBack: boolean) => ({
  //   x: window.outerWidth + 5,
  // }),
  // next: (isBack: boolean) => ({
  //   x: -window.outerWidth - 5,
  // }),
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export const boxMaskVariants = {
  normal: (custom: string) => ({
    scale: 1,
  }),
  hover: (custom: string) => ({
    scale: 1.4,
    y: -50,
    zIndex: 10,
    transition: { delay: 0.7, duration: 0.1, type: "tween" },
  }),

  exit: (custom: string) => ({
    transformOrigin:
      custom === "firstChild"
        ? "center left"
        : custom === "lastChild"
          ? "center right"
          : "center",
    transition: { delay: 0.4, duration: 3, ease: "easeInOut" },
  }),
};

const boxVariants = {
  hover: (custom: string) => ({
    opacity: 0,
    // transition: { delay: 0.4, duration: 0.1, ease: "easeInOut" },
  }),
};

const infoVariants = {
  // normal: { y: "8.9vw" },
  hover: {
    opacity: 1,
    visibility: "visible" as const, //const assertion
    // y: "100%",
    transition: { delay: 0.7, duration: 0.1, type: "tween" },
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

interface IUrlMatch {
  isExact: boolean;
  params: { title: string; movieId: string };
  path: string;
  url: string;
}

function SliderRow(props: {
  category: string;
  title: string;
  data: IGetMovieResult;
}) {
  const { data, title, category } = props;

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const [next, setNext] = useState(true);
  const [change, setChange] = useState(0);
  const [boxClicked, setBoxClicked] = useState(false);
  const [boxId, setBoxId] = useState<number | null>();
  const [queryId, setQueryId] = useRecoilState(paramIdState);
  const [overlayClicked, setOverlayClicked] =
    useRecoilState(overlayClickedState);
  // const [hovering, setHovering] = useState(false);
  const [hovering, setHovering] = useRecoilState(hoverState);
  const [hoverTitle, setTtile] = useState<string | null>();
  const [target, setTarget] = useState<EventTarget | null>();
  const [movieState, setMovieState] = useState<IMovie>();
  const [childOrder, setChildOrder] = useState("");
  const [hoverId, setHoverId] = useState<number | null>();

  // console.log("hoverTitle", hoverTitle);
  // console.log("title", title);

  const history = useHistory();

  const bigMovieMatch = useRouteMatch<{ movieId: string; title: string }>(
    "/movies/:title/:movieId",
  );
  const bigTvMatch = useRouteMatch<{ movieId: string; title: string }>(
    "/tv/:title/:movieId",
  );

  let urlMatch: IUrlMatch | null = null;
  bigMovieMatch
    ? (urlMatch = bigMovieMatch)
    : bigTvMatch
      ? (urlMatch = bigTvMatch)
      : (urlMatch = null);

  // console.log("urlMatch=>", urlMatch);

  const { scrollY } = useScroll();
  // console.log("SliderRow", scrollY.get());

  const nextBtn = () => {
    setBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
    setChange(1);
  };

  const prevBtn = () => {
    setBack(true);
    setChange(1);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleLeaving = () => {
    // console.log("AnimatePresence onExitComplete");
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = (movieId: number, title: string, category: string) => {
    setBoxClicked(true);
    if (category === "movies") {
      setQueryId(+movieId);
      history.push(`/movies/${title}/${movieId}`);
    } else if (category === "tv") {
      setQueryId(+movieId);
      history.push(`/tv/${title}/${movieId}`);
    }
  };
  const onBoxHover = (
    event: React.MouseEvent<HTMLDivElement>,
    // event: MouseEvent<Element, MouseEvent>,
    // event: globalThis.MouseEvent
    // data: string
  ) => {
    // console.log(
    //   "onBoxHover",
    //   event.currentTarget.children[0].getAttribute("src")
    // );
    // console.log("data", data);
    // event.currentTarget.children[0].setAttribute("src", data);
    // console.log(event.currentTarget.setAttribute("style", "z-index:2;"));
    // console.log(event.currentTarget);

    // event.currentTarget.parentElement?.setAttribute("style", "z-index:5");
    // console.log(event.currentTarget.parentElement?.firstChild);
    // console.log(
    //   event.currentTarget.parentElement?.lastChild === event.currentTarget
    // );
    if (event.currentTarget.parentElement?.lastChild === event.currentTarget) {
      setChildOrder("lastChild");
    } else if (
      event.currentTarget.parentElement?.firstChild === event.currentTarget
    ) {
      setChildOrder("firstChild");
    } else {
      setChildOrder("");
    }
    // event.currentTarget.children[0].setAttribute("style", "z-index:5;");
    // event.currentTarget.setAttribute("style", "z-index:5;");
  };

  const hoverTest = (id: number) => {
    setHovering(true);
    setHoverId(id);
    // setQueryId(id);
    // setMovieState(movie);
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
      <RowHover>
        <Category>{titleList[title]}</Category>
        <Slider>
          <Prev onClick={prevBtn}>
            <b>&#10094;</b>
          </Prev>
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
          <AnimatePresence
            initial={false}
            onExitComplete={toggleLeaving}
            custom={back}
          >
            <Row
              $movies={data?.results.length}
              custom={back}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ ease: "linear", duration: 0.5 }}
              key={index + title}
              id={index + ""}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  // <AnimatePresence
                  //   custom={childOrder}
                  //   key={movie.id + title + "presence"}
                  // >
                  <BoxMask
                    key={movie.id + title + "mask"}
                    variants={boxMaskVariants}
                    custom={childOrder}
                    initial="normal"
                    exit="exit"
                    whileHover="hover"
                    onClick={() => {
                      setBoxClicked(true);
                      setBoxId(movie.id);
                    }}
                    onHoverStart={(event) => {
                      setHoverId(movie.id);
                      setTtile(title);
                      setHovering(true);
                      setMovieState(movie);
                    }}
                    onMouseEnter={(event) => {
                      onBoxHover(event);
                    }}
                    $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    transition={{ type: "tween" }}
                  >
                    <Info>
                      <h4>
                        {category === "movies" ? movie.title : movie.name}|{" "}
                        {movie.id}
                      </h4>
                    </Info>
                    <Box
                      key={movie.id + title + "box"}
                      layoutId={movie.id + title}
                      $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      onClick={() => {
                        onBoxClicked(movie.id, title, category);
                        setBoxClicked(true);
                      }}
                      transition={{ type: "tween" }}
                    ></Box>
                    <InfoContainer
                      variants={infoVariants}
                      key={movie.id + "info"}
                      onClick={(event) => {
                        onBoxClicked(movie.id, title, category);
                      }}
                    >
                      <IconsContainer>
                        <Icons>
                          <PlayIcon
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            onClick={(event) => {
                              event.stopPropagation();
                              // console.log("PlayIocn");
                            }}
                          >
                            <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
                          </PlayIcon>
                          <AddIcon onClick={(event) => event.stopPropagation()}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                            >
                              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                            </svg>
                          </AddIcon>
                          <ThumbIcon
                            onClick={(event) => event.stopPropagation()}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                            >
                              <path d="M288.8 81.7c3.5-12.8 16.7-20.3 29.5-16.8s20.3 16.7 16.8 29.5l-4.5 16.4c-5.5 20.2-13.9 39.3-24.7 56.9c-3.1 4.9-3.2 11.1-.4 16.2s8.2 8.2 14 8.2L448 192c17.7 0 32 14.3 32 32c0 11.3-5.9 21.3-14.8 27c-7.2 4.6-9.5 13.9-5.3 21.3c2.6 4.6 4.1 10 4.1 15.7c0 12.4-7 23.1-17.3 28.5c-4.2 2.2-7.3 6.1-8.3 10.8s.1 9.5 3 13.2c4.2 5.4 6.7 12.2 6.7 19.5c0 14.2-9.2 26.3-22.1 30.4c-7.8 2.5-12.4 10.6-10.7 18.6c.5 2.2 .7 4.5 .7 6.9c0 17.7-14.3 32-32 32l-89.5 0c-15.8 0-31.2-4.7-44.4-13.4l-38.5-25.7c-9-6-16.6-13.7-22.4-22.6c-4.9-7.4-14.8-9.4-22.2-4.6s-9.4 14.8-4.6 22.2c8.1 12.3 18.7 23.1 31.4 31.6l38.5 25.7c18.4 12.3 40 18.8 62.1 18.8l89.5 0c35.3 0 64-28.7 64-64l0-.6c19.1-11.1 32-31.7 32-55.4c0-8.7-1.8-17.1-4.9-24.7C487.9 323.6 496 306.8 496 288c0-6.5-1-12.8-2.8-18.7C504.8 257.7 512 241.7 512 224c0-35.3-28.7-64-64-64l-101.6 0c6.2-13.1 11.3-26.7 15.1-40.9l4.5-16.4c8.1-29.8-9.5-60.6-39.3-68.8s-60.6 9.5-68.8 39.3l-4.5 16.4c-8.9 32.6-29.6 60.8-58.2 79l-3.1 2c-11.8 7.5-21.7 17.1-29.5 28.2c-5.1 7.2-3.3 17.2 4 22.3s17.2 3.3 22.3-4c5.4-7.7 12.2-14.4 20.4-19.5l3.1-2c35.3-22.4 60.9-57.2 71.9-97.5l4.5-16.4zM32 224l64 0 0 224-64 0 0-224zM0 224L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32z" />
                            </svg>
                          </ThumbIcon>
                        </Icons>
                        <OpenIcon
                          onClick={() =>
                            onBoxClicked(movie.id, title, category)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                          </svg>
                        </OpenIcon>
                      </IconsContainer>
                      {category === "movies" &&
                      hoverId === movie.id &&
                      title === hoverTitle ? (
                        <MovieHoveringInfo
                          movieId={hoverId}
                          title={title}
                          movie={movie}
                        />
                      ) : category === "tv" &&
                        hoverId === movie.id &&
                        title === hoverTitle ? (
                        <TVHoveringInfo
                          movieId={hoverId}
                          title={title}
                          movie={movie}
                        />
                      ) : null}
                    </InfoContainer>
                  </BoxMask>
                  // </AnimatePresence>
                ))}
            </Row>
          </AnimatePresence>
          <Next onClick={nextBtn}>
            <b>&#10095;</b>
          </Next>
        </Slider>
      </RowHover>
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
