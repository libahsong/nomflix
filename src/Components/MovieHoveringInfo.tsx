import { motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovieCertification,
  getMovieDetails,
  IGetMovieDetails,
  IMovie,
  IMovieCertification,
} from "../api";
import { useRecoilState } from "recoil";
import { paramIdState } from "../atoms";
import { Box } from "./SliderRow";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";

export const HoveringContainer = styled(motion.div)`
  /* position: absolute; */
`;

export const InfoContainer = styled(motion.div)`
  opacity: 0;
  /* box-sizing: border-box; */
  /* width: 100%; */
  /* z-index: 10; */
  padding: 1vw;
  /* visibility: hidden; */
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
`;
const IconsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Icons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.2vw;
`;

const PlayIcon = styled.svg`
  width: 2vw;
  height: 2vw;
  fill: white;
  cursor: pointer;
`;

export const AddIcon = styled(motion.div)`
  &:hover {
    border: 1px solid ${(props) => props.theme.white.lighter};
    background-color: ${(props) => props.theme.black.lighter};
  }
  cursor: pointer;
  width: 2vw;
  height: 2vw;
  border: 1px solid ${(props) => props.theme.black.lighter};
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

const ThumbIcon = styled(AddIcon)``;

const OpenIcon = styled(AddIcon)``;

const ReleaseInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8vw;
  margin-bottom: 0.3vw;
`;

const RatingContainer = styled.div``;
const RatingIcon = styled.div<{ $rating: string | null }>`
  margin-right: 0.5vw;
  border-radius: 5px;
  background-color: ${(props) =>
    props.$rating === "R"
      ? props.theme.rating.r
      : props.$rating === "PG"
      ? props.theme.rating.pg
      : props.$rating === "PG-13"
      ? props.theme.rating.pg13
      : props.$rating === "G"
      ? props.theme.rating.g
      : props.$rating === "NC-17"
      ? props.theme.rating.nc17
      : props.theme.rating.nr};
  font-weight: 700;
  padding: ${(props) =>
    props.$rating === "R" || props.$rating === "G"
      ? "0.05vw 0.25vw"
      : "0.05vw"};
  font-size: ${(props) =>
    props.$rating === "R" || props.$rating === "G" ? "1.2vw" : "1vw"};
  color: ${(props) =>
    props.$rating === "NR"
      ? props.theme.black.veryDark
      : props.theme.white.lighter};
`;
const Season = styled.div`
  margin-right: 0.5vw;
`;
const HD = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-right: 0.5vw;
  padding: 0.04vw 0.1vw;
  font-size: 0.6vw;
  border-radius: 4px;
`;
const Genres = styled.div`
  span {
    font-size: 0.8vw;
  }
  b {
    padding: 0.2vw;
    font-weight: 700;
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    // visibility: "visible" as const, //const assertion
    transition: { delay: 0.4, duration: 0.1, ease: "easeInOut" },
  },
};

export const boxMaskVariants = {
  normal: { scale: 1 },
  hover: (custom: string) => ({
    scale: 1.3,
    y: -50,
    zIndex: 10,
    transition: { delay: 0.4, duration: 0.1, ease: "easeInOut" },
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

export function MovieHoveringInfo(props: {
  movieId: number | null;
  title?: string;
  movie: IMovie | null;
}) {
  const { movieId, title, movie } = props;
  // const { title, movie } = props;
  // console.log("MovieHoveringInfo movieId", title, movieId);

  //   const [hovering, setHovering] = useRecoilState(hoverState);
  // console.log("Hovering movie", movie.title, movie.id);
  // console.log("movieId", movieId);

  const [queryId, setQueryId] = useRecoilState(paramIdState);
  const [rating, setRating] = useState();

  const { data: certification, isLoading: isMovieCertification } =
    // useQuery<IMovieCertification>(["movie", "movieCertification"], () =>
    useQuery<IMovieCertification>(["movie", movieId], () =>
      getMovieCertification(movieId)
    );

  let ratingTemp: string | null = null;

  const { data: details, isLoading: isMovieDetails } =
    useQuery<IGetMovieDetails>(["movie", "movieDetails"], () =>
      getMovieDetails(movieId)
    );

  return (
    <>
      <ReleaseInfo>
        <RatingContainer>
          {(() => {
            let arr = [] as any;
            certification?.results
              ?.filter((r) => r.iso_3166_1 === "US")
              .filter((r) =>
                r.release_dates?.forEach((v) => {
                  if (v.certification !== "") arr.push(v.certification);
                })
              );
            ratingTemp = arr[0];
            return (
              <RatingIcon $rating={ratingTemp ? ratingTemp : null}>
                {ratingTemp}
              </RatingIcon>
            );
          })()}
        </RatingContainer>
        <Season>
          {details?.runtime ? Math.floor(details?.runtime / 60) : 0}h
          {details?.runtime ? details?.runtime % 60 : 0}m
        </Season>
        <HD>HD</HD>
      </ReleaseInfo>
      <Genres>
        {(() => {
          let arr = [] as any;
          details?.genres?.forEach((v) => {
            arr.push(<span key={v.name}>{v.name}</span>);
            arr.push(<b key={v.name + "dot"}>·</b>);
          });
          return arr.length > 6
            ? arr.slice(0, 5)
            : arr.slice(0, arr.length - 1);
        })()}
      </Genres>
    </>
  );
}
