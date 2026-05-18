/* eslint-disable @typescript-eslint/no-unused-vars */

import { useHistory } from "react-router-dom";
import {
  getTvCredits,
  getTvDetails,
  IGetMovieCredits,
  IGetTvDetails,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import {
  BigContainer,
  BigCover,
  BigMovie,
  BigMovieInfo,
  BigOverview,
  BigTitle,
  BigTitleIcons,
  Overlay,
} from "./SliderRow";
import { useRecoilState } from "recoil";
import { paramIdState } from "../atoms";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion } from "framer-motion";

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 0.25vw 1.2vw;
  border-radius: 5px;
  border: 0;
  span {
    font-size: 1.2vw;
    margin-left: 0.4vw;
  }
  cursor: pointer;
`;

const PlayIcon = styled.svg`
  width: 1.7vw;
  height: 1.7vw;
  fill: black;
`;

const AddIcon = styled(motion.div)`
  &:hover {
    border: 1.2px solid ${(props) => props.theme.white.lighter} !important;
    background-color: ${(props) => props.theme.black.lighter};
  }
  cursor: pointer;
  width: 2.5vw;
  height: 2.5vw;
  border: 1.2px solid ${(props) => props.theme.black.lighter} !important;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 1.2vw;
    height: 1.2vw;
    fill: white;
  }
  margin-left: 0.5vw;
`;

const ThumbIcon = styled(AddIcon)``;

function TvOverlay(props: {
  urlMatch: any;
  title: string;
  scrollY: any;
  clickedContent: IMovie | null;
  category: string;
}) {
  const { urlMatch, title, scrollY, clickedContent, category } = props;

  const history = useHistory();
  const [queryId, setQueryId] = useRecoilState(paramIdState);

  const { data: details, isLoading: isTvDetails } = useQuery<IGetTvDetails>(
    ["tv", "tvDetails"],
    () => getTvDetails(queryId),
  );
  console.log("tvDetails", details);

  const { data: credits, isLoading: isTvCredits } = useQuery<IGetMovieCredits>(
    ["tv", "tvCredits"],
    () => getTvCredits(queryId),
  );

  const onOverlayClick = () => {
    if (category === "movies") return history.push("/");
    if (category === "tv") return history.push("/tv");
  };

  return (
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
                $bgPhoto={makeImagePath(clickedContent.backdrop_path, "w500")}
              >
                {" "}
                <BigTitle>
                  <h2>
                    {category === "movies"
                      ? clickedContent.title
                      : clickedContent.name}
                  </h2>
                  <BigTitleIcons>
                    <Button>
                      <PlayIcon
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        version="1.1"
                        id="Capa_1"
                        viewBox="0 0 17.804 17.804"
                      >
                        <g>
                          <g id="c98_play">
                            <path d="M2.067,0.043C2.21-0.028,2.372-0.008,2.493,0.085l13.312,8.503c0.094,0.078,0.154,0.191,0.154,0.313    c0,0.12-0.061,0.237-0.154,0.314L2.492,17.717c-0.07,0.057-0.162,0.087-0.25,0.087l-0.176-0.04    c-0.136-0.065-0.222-0.207-0.222-0.361V0.402C1.844,0.25,1.93,0.107,2.067,0.043z" />
                          </g>
                          <g id="Capa_1_78_"></g>
                        </g>
                      </PlayIcon>
                      <span>재생</span>
                    </Button>
                    <AddIcon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                      </svg>
                    </AddIcon>
                    <ThumbIcon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M288.8 81.7c3.5-12.8 16.7-20.3 29.5-16.8s20.3 16.7 16.8 29.5l-4.5 16.4c-5.5 20.2-13.9 39.3-24.7 56.9c-3.1 4.9-3.2 11.1-.4 16.2s8.2 8.2 14 8.2L448 192c17.7 0 32 14.3 32 32c0 11.3-5.9 21.3-14.8 27c-7.2 4.6-9.5 13.9-5.3 21.3c2.6 4.6 4.1 10 4.1 15.7c0 12.4-7 23.1-17.3 28.5c-4.2 2.2-7.3 6.1-8.3 10.8s.1 9.5 3 13.2c4.2 5.4 6.7 12.2 6.7 19.5c0 14.2-9.2 26.3-22.1 30.4c-7.8 2.5-12.4 10.6-10.7 18.6c.5 2.2 .7 4.5 .7 6.9c0 17.7-14.3 32-32 32l-89.5 0c-15.8 0-31.2-4.7-44.4-13.4l-38.5-25.7c-9-6-16.6-13.7-22.4-22.6c-4.9-7.4-14.8-9.4-22.2-4.6s-9.4 14.8-4.6 22.2c8.1 12.3 18.7 23.1 31.4 31.6l38.5 25.7c18.4 12.3 40 18.8 62.1 18.8l89.5 0c35.3 0 64-28.7 64-64l0-.6c19.1-11.1 32-31.7 32-55.4c0-8.7-1.8-17.1-4.9-24.7C487.9 323.6 496 306.8 496 288c0-6.5-1-12.8-2.8-18.7C504.8 257.7 512 241.7 512 224c0-35.3-28.7-64-64-64l-101.6 0c6.2-13.1 11.3-26.7 15.1-40.9l4.5-16.4c8.1-29.8-9.5-60.6-39.3-68.8s-60.6 9.5-68.8 39.3l-4.5 16.4c-8.9 32.6-29.6 60.8-58.2 79l-3.1 2c-11.8 7.5-21.7 17.1-29.5 28.2c-5.1 7.2-3.3 17.2 4 22.3s17.2 3.3 22.3-4c5.4-7.7 12.2-14.4 20.4-19.5l3.1-2c35.3-22.4 60.9-57.2 71.9-97.5l4.5-16.4zM32 224l64 0 0 224-64 0 0-224zM0 224L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32z" />
                      </svg>
                    </ThumbIcon>
                  </BigTitleIcons>
                </BigTitle>
              </BigCover>
              <BigContainer>
                <BigOverview>
                  <span>{details?.first_air_date.slice(0, 4)}</span>
                  <span>{details?.number_of_seasons}seasons</span>
                  <p>{clickedContent.overview}</p>
                </BigOverview>
                <BigMovieInfo>
                  {credits?.crew ? (
                    <li>
                      <span>director:</span>
                      {credits?.crew
                        .filter((c) => c.job === "Director")
                        .map((v) => v.name)
                        .join()}
                    </li>
                  ) : null}
                  {credits?.crew ? (
                    <li>
                      <span>writer:</span>
                      {credits?.crew
                        .filter((v) => v.department === "Writing")
                        .slice(0, 1)
                        .map((v) => v.name)
                        .join()}
                    </li>
                  ) : null}
                  {credits?.cast.length ? (
                    <li>
                      <span>cast:</span>
                      {credits?.cast.length > 5
                        ? credits?.cast
                            .map((actor) => actor.name)
                            .slice(0, 5)
                            .join()
                        : credits?.cast.length === 1
                          ? credits?.cast.map((actor) => actor.name).join()
                          : null}
                    </li>
                  ) : null}

                  <li>
                    <span>genres:</span>
                    {details?.genres.map((v) => v.name).join()}
                  </li>
                </BigMovieInfo>
              </BigContainer>
            </>
          ) : null}
        </BigMovie>
      ) : null}
    </>
  );
}

export default TvOverlay;
