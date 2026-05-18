/* eslint-disable @typescript-eslint/no-unused-vars */

import { motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getTvDetails,
  getTvRating,
  IGetTvDetails,
  IMovie,
  ITvRating,
} from "../api";

export const HoveringContainer = styled(motion.div)``;

export const InfoContainer = styled(motion.div)`
  opacity: 0;
  padding: 1vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  border-radius: 0 0 3px 3px;
  color: #ece4e4;
  background-color: ${(props) => props.theme.black.darker};
  h4 {
    text-align: center;
    font-size: 1.2vw;
    opacity: 1;
    font-weight: 500;
  }
`;

export const Icons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.2vw;
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
    props.$rating === "TV-G"
      ? props.theme.tvRating.tvg
      : props.$rating === "TV-Y"
        ? props.theme.tvRating.tvy
        : props.$rating === "TV-PG"
          ? props.theme.rating.pg13
          : props.$rating === "TV-Y7"
            ? props.theme.tvRating.tvy7
            : props.$rating === "TV-Y7-FV"
              ? props.theme.tvRating.tvy7fv
              : props.$rating === "TV-14"
                ? props.theme.tvRating.tv14
                : props.$rating === "TV-MA"
                  ? props.theme.tvRating.tvma
                  : props.theme.tvRating.nr};
  font-weight: 700;
  padding: ${(props) =>
    props.$rating === "R" || props.$rating === "G"
      ? "0.05vw 0.25vw"
      : "0.05vw"};
  font-size: ${(props) =>
    props.$rating === "R" || props.$rating === "G" ? "1.2vw" : "1vw"};
  color: ${(props) =>
    props.$rating === "NR" || "TV-G" || "TV-Y"
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

export function TVHoveringInfo(props: {
  movieId: number | null;
  title?: string;
  movie: IMovie | null;
}) {
  console.log("TVHoveringInfo");

  const { movieId, title, movie } = props;

  const { data: tvRating, isLoading: isTvRating } = useQuery<ITvRating>(
    ["tv", movieId],
    () => getTvRating(movieId),
  );

  let ratingTemp: string | null = null;

  const { data: tvDetails, isLoading: isTvDetails } = useQuery<IGetTvDetails>(
    ["tv", "tvDetails"],
    () => getTvDetails(movieId),
  );

  console.log("tvDetails", tvDetails);

  return (
    <>
      <ReleaseInfo>
        <RatingContainer>
          {(() => {
            let arr = [] as any;
            tvRating?.results?.filter((r) => {
              if (r.iso_3166_1 === "US") arr.push(r.rating);
              return console.log(arr);
            });
            if (arr.length === 0) {
              console.log(
                "arr.length === 0",
                tvRating?.results[0]?.iso_3166_1,
                tvRating?.results[0]?.rating,
              );

              arr.push(tvRating?.results[0]?.rating);
            }
            ratingTemp = arr[0] ? arr[0] : "NR";
            return (
              <RatingIcon $rating={ratingTemp ? ratingTemp : null}>
                {ratingTemp}
              </RatingIcon>
            );
          })()}
        </RatingContainer>
        <Season>
          {tvDetails?.number_of_seasons} <span>seasons</span>
        </Season>
        <HD>HD</HD>
      </ReleaseInfo>
      <Genres>
        {(() => {
          let arr = [] as any;
          tvDetails?.genres.forEach((v) => {
            arr.push(<span>{v.name}</span>);
            arr.push(<b>·</b>);
          });
          return arr.length > 6
            ? arr.slice(0, 5)
            : arr.slice(0, arr.length - 1);
        })()}
      </Genres>
    </>
  );
}
