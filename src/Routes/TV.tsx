import { useQuery } from "react-query";
import {
  getAiringTody,
  getOnTheAir,
  getPopularShows,
  getTopRatedShows,
  IGetMovieResult,
} from "../api";
import SliderRow from "../Components/SliderRow";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
  /* width: 100vw; */
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
  height: 39.5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
  font-weight: 900;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Sliders = styled.div`
  /* width: 100vh; */
  /* position: relative; */
  /* display: grid; */
  /* grid-template-rows: auto; */
  /* height: 100vh; */
`;
function Tv() {
  const { data: airingShows, isLoading } = useQuery<IGetMovieResult>(
    ["tvShows", "airingToday"],
    getAiringTody
  );
  // console.log("airingShows=>", airingShows);
  const { data: onAirShows, isLoading: onAirLoading } =
    useQuery<IGetMovieResult>(["tvShows", "onTheAir"], getOnTheAir);
  // console.log("onAirShows=>", onAirShows);
  const { data: popularShows, isLoading: popularLoading } =
    useQuery<IGetMovieResult>(["tvShows", "popular"], getPopularShows);
  // console.log("popularShows", popularShows);
  const { data: topRatedShows, isLoading: topRatedLoading } =
    useQuery<IGetMovieResult>(["tvShows", "topRated"], getTopRatedShows);
  console.log("topRatedShows", topRatedShows);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : airingShows ? (
        <>
          <Banner
            $bgPhoto={makeImagePath(
              airingShows?.results[0].backdrop_path || ""
            )}
          >
            <Title>{airingShows?.results[0].original_name}</Title>
            <Overview>{airingShows?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            {<SliderRow category="tv" title="airingToday" data={airingShows} />}
            {onAirShows ? (
              <SliderRow category="tv" title="onTheAir" data={onAirShows} />
            ) : null}
            {popularShows ? (
              <SliderRow category="tv" title="popularTv" data={popularShows} />
            ) : null}
            {topRatedShows ? (
              <SliderRow category="tv" title="topTv" data={topRatedShows} />
            ) : null}
          </Sliders>
        </>
      ) : null}
    </Wrapper>
  );
}

export default Tv;
