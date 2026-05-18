/* eslint-disable @typescript-eslint/no-unused-vars */

import styled from "styled-components";
import SliderRow from "../Components/SliderRow";
import { useQuery } from "react-query";
import {
  getMovies,
  getPopularMovies,
  getTopRated,
  getUpcoming,
  IGetMovieResult,
} from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding: 0 0 50px;
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
  position: relative;
  padding: 0 60px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  margin-bottom: 3vw;
  font-weight: 400;
  font-size: 5vw;
  line-height: 1.25vw;
`;

const Overview = styled.p`
  color: #fff;
  font-size: 1.2vw;
  font-weight: 400;
  line-height: normal;
  width: 50%;
`;

const Sliders = styled.div``;

function Home() {
  const { data: nowMovies, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies,
  );

  const { data: popularMovies, isLoading: popularLoading } =
    useQuery<IGetMovieResult>(["movies", "popular"], getPopularMovies);

  const { data: topRated, isLoading: topRatedLoading } =
    useQuery<IGetMovieResult>(["movies", "topRated"], getTopRated);

  const { data: upcoming, isLoading: upcomingLoading } =
    useQuery<IGetMovieResult>(["movies", "upcoming"], getUpcoming);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : nowMovies ? (
        <>
          <Banner
            $bgPhoto={makeImagePath(nowMovies?.results[0].backdrop_path || "")}
          >
            <Title>{nowMovies?.results[0].title}</Title>
            <Overview>{nowMovies?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            <SliderRow
              key="now"
              category="movies"
              title="now"
              data={nowMovies}
            />
            {popularMovies ? (
              <SliderRow
                category="movies"
                title="popular"
                data={popularMovies}
              />
            ) : null}
            {topRated ? (
              <SliderRow
                key="top"
                category="movies"
                title="top"
                data={topRated}
              />
            ) : null}
            {upcoming ? (
              <SliderRow
                key="upcoming"
                category="movies"
                title="upcoming"
                data={upcoming}
              />
            ) : null}
          </Sliders>
        </>
      ) : null}
    </Wrapper>
  );
}
export default Home;
