import styled from "styled-components";
import SliderRow from "../Components/SliderRow";
import { useQuery } from "react-query";
import {
  getMovies,
  getSearchMovie,
  getPopularMovies,
  getTopRated,
  getUpcoming,
  IGetMovieResult,
} from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding: 0 0 50px;
  /* overflow-x: visible;
  overflow-y: visible; */

  /* &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none; */

  /* overflow-x: hidden; */
  /* overflow: hidden; */
  /* overflow-y: hidden; */
  /* z-index: -3; */
  /* width: 100vw; */
  /* min-height: 1000px; */
  /* position: relative; */
  /* z-index: 0; */
  /* display: flex; */
  /* flex-direction: column; */
  /* box-sizing: border-box; */
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
  /* position: absolute; */
  position: relative;
  padding: 0 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  /* z-index: -2; */
`;
const Title = styled.h2`
  /* font-size: 68px; */
  margin-bottom: 3vw;
  font-weight: 400;
  font-size: 5vw;
  line-height: 1.25vw;
`;

const Overview = styled.p`
  /* font-size: 30px; */
  color: #fff;
  font-size: 1.2vw;
  font-weight: 400;
  line-height: normal;
  width: 50%;
`;

const Sliders = styled.div`
  //z-index: 0;
  //position: absolute;
  //top: 80vh;
  //width: 100%;
  /* overflow-x: hidden; */
  /* overflow-y: hidden; */
  /* position: relative; //BigMovie card scrollY().get+100 is going to be related to Sliders scrollY */
  /* display: grid; */
  /* grid-template-rows: auto; */
  /* height: 100vh; */
`;

function Home() {
  const { data: nowMovies, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  // console.log("nowMovies", nowMovies);

  const { data: popularMovies, isLoading: popularLoading } =
    useQuery<IGetMovieResult>(["movies", "popular"], getPopularMovies);
  // console.log("popularMovies=>", popularMovies);

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
