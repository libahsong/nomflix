/* eslint-disable @typescript-eslint/no-unused-vars */

import styled from "styled-components";
import { motion } from "framer-motion";
import { IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { categoryState } from "../atoms";
import {
  AddIcon,
  Category,
  Icons,
  IconsContainer,
  InfoContainer,
  OpenIcon,
  PlayIcon,
  ThumbIcon,
  titleList,
} from "./SliderRow";
import { useState } from "react";
import { MovieHoveringInfo } from "./MovieHoveringInfo";
import { TVHoveringInfo } from "./TVHoveringInfo copy";

const Rows = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, calc(98% / 6));
  grid-auto-rows: 9vw;
  gap: 0.4%;
  row-gap: 4.5vw;
  line-height: 1.6;
  margin-top: 10px;
  position: relative;
  margin-bottom: 5vw;
`;

const BoxMask = styled(motion.div)<{ $bgPhoto: string | null }>`
  cursor: pointer;
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
  &:nth-child(6n) {
    transform-origin: center right;
  }
  &:nth-child(6n + 1) {
    transform-origin: center left;
  }
`;

const Info = styled(motion.div)`
  cursor: pointer;
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: 1;
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

const infoVariants = {
  // normal: { y: "8.9vw" },
  hover: {
    opacity: 1,
    visibility: "visible" as const, //const assertion
    // y: "100%",
    transition: { delay: 0.7, duration: 0.1, type: "tween" },
  },
};

// const boxVariants = {
//   normal: { scale: 1 },
//   hover: {
//     scale: 1.3,
//     transition: { delay: 0.5, duration: 0.1, type: "tween" },
//   },
// };

// const infoVariants = {
//   hover: {
//     opacity: 1,
//     transition: { delay: 0.5, duration: 0.1, type: "tween" },
//   },
// };

function SearchRow(props: {
  keyword: string | null;
  data: IGetMovieResult;
  category: string;
  key: string;
}) {
  const { keyword, data, category } = props;
  // console.log(data);
  const history = useHistory();
  const setCategory = useSetRecoilState(categoryState);
  // const [categoryAtom, setCategory] = useRecoilState(categoryState);

  const [boxClicked, setBoxClicked] = useState(false);
  const [boxId, setBoxId] = useState<number | null>();
  const [hoverId, setHoverId] = useState<number | null>();
  const [childOrder, setChildOrder] = useState("");

  const onBoxClicked = (movieId: number, keyword: string | null) => {
    setCategory(category);
    history.push(`/search?keyword=${keyword}&movieId=${movieId}`);
  };

  const onBoxHover = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log(
      event.currentTarget.parentElement?.lastChild === event.currentTarget,
    );
    if (event.currentTarget.parentElement?.lastChild === event.currentTarget) {
      setChildOrder("lastChild");
    } else if (
      event.currentTarget.parentElement?.firstChild === event.currentTarget
    ) {
      setChildOrder("firstChild");
    } else {
      setChildOrder("");
    }
  };

  return (
    <>
      <Category key={titleList[category]}>{titleList[category]}</Category>
      <Rows key={keyword + category}>
        {data?.results.map((movie) => (
          <BoxMask
            key={movie.id + category + "mask"}
            variants={boxMaskVariants}
            initial="normal"
            exit="exit"
            whileHover="hover"
            onClick={() => {
              setBoxClicked(true);
              setBoxId(movie.id);
            }}
            onHoverStart={(event) => {
              setHoverId(movie.id);
            }}
            onMouseEnter={(event) => {
              onBoxHover(event);
            }}
            $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
            transition={{ type: "tween" }}
          >
            <Info
              key={movie.id + category + "box"}
              layoutId={movie.id + category}
              onClick={() => {
                onBoxClicked(movie.id, keyword);
                setBoxClicked(true);
              }}
            >
              <h4>
                {category === "movies" ? movie.title : movie.name}| {movie.id}
              </h4>
            </Info>

            <InfoContainer
              variants={infoVariants}
              key={movie.id + category + "info"}
              onClick={(event) => {
                onBoxClicked(movie.id, keyword);
              }}
            >
              <IconsContainer>
                <Icons>
                  <PlayIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    onClick={(event) => {
                      event.stopPropagation();
                      console.log("PlayIocn");
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
                  <ThumbIcon onClick={(event) => event.stopPropagation()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M288.8 81.7c3.5-12.8 16.7-20.3 29.5-16.8s20.3 16.7 16.8 29.5l-4.5 16.4c-5.5 20.2-13.9 39.3-24.7 56.9c-3.1 4.9-3.2 11.1-.4 16.2s8.2 8.2 14 8.2L448 192c17.7 0 32 14.3 32 32c0 11.3-5.9 21.3-14.8 27c-7.2 4.6-9.5 13.9-5.3 21.3c2.6 4.6 4.1 10 4.1 15.7c0 12.4-7 23.1-17.3 28.5c-4.2 2.2-7.3 6.1-8.3 10.8s.1 9.5 3 13.2c4.2 5.4 6.7 12.2 6.7 19.5c0 14.2-9.2 26.3-22.1 30.4c-7.8 2.5-12.4 10.6-10.7 18.6c.5 2.2 .7 4.5 .7 6.9c0 17.7-14.3 32-32 32l-89.5 0c-15.8 0-31.2-4.7-44.4-13.4l-38.5-25.7c-9-6-16.6-13.7-22.4-22.6c-4.9-7.4-14.8-9.4-22.2-4.6s-9.4 14.8-4.6 22.2c8.1 12.3 18.7 23.1 31.4 31.6l38.5 25.7c18.4 12.3 40 18.8 62.1 18.8l89.5 0c35.3 0 64-28.7 64-64l0-.6c19.1-11.1 32-31.7 32-55.4c0-8.7-1.8-17.1-4.9-24.7C487.9 323.6 496 306.8 496 288c0-6.5-1-12.8-2.8-18.7C504.8 257.7 512 241.7 512 224c0-35.3-28.7-64-64-64l-101.6 0c6.2-13.1 11.3-26.7 15.1-40.9l4.5-16.4c8.1-29.8-9.5-60.6-39.3-68.8s-60.6 9.5-68.8 39.3l-4.5 16.4c-8.9 32.6-29.6 60.8-58.2 79l-3.1 2c-11.8 7.5-21.7 17.1-29.5 28.2c-5.1 7.2-3.3 17.2 4 22.3s17.2 3.3 22.3-4c5.4-7.7 12.2-14.4 20.4-19.5l3.1-2c35.3-22.4 60.9-57.2 71.9-97.5l4.5-16.4zM32 224l64 0 0 224-64 0 0-224zM0 224L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32z" />
                    </svg>
                  </ThumbIcon>
                </Icons>
                <OpenIcon onClick={() => onBoxClicked(movie.id, category)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </OpenIcon>
              </IconsContainer>
              {category === "movies" && hoverId === movie.id ? (
                <MovieHoveringInfo movieId={hoverId} movie={movie} />
              ) : category === "tvShows" && hoverId === movie.id ? (
                <TVHoveringInfo movieId={hoverId} movie={movie} />
              ) : null}
            </InfoContainer>
          </BoxMask>
        ))}
      </Rows>
    </>
  );
}

export default SearchRow;
