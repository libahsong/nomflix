import { useHistory } from "react-router-dom";
import {
  getMovieCredits,
  getMovieDetails,
  IGetMovieCredits,
  IGetMovieDetails,
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
  Overlay,
} from "./SliderRow";
import { useRecoilState } from "recoil";
import { paramIdState } from "../atoms";
import { useQuery } from "react-query";
import { AnimatePresence } from "framer-motion";

function MovieOverlay(props: {
  urlMatch: any;
  title: string;
  scrollY: any;
  clickedContent: IMovie | null;
  category: string;
}) {
  const { urlMatch, title, scrollY, clickedContent, category } = props;
  console.log("BigcardOverlay category", category);

  const history = useHistory();
  const [queryId, setQueryId] = useRecoilState(paramIdState);

  const { data: details, isLoading: isMovieDetails } =
    useQuery<IGetMovieDetails>(["movie", "movieDetails"], () =>
      getMovieDetails(queryId)
    );
  const { data: credits, isLoading: isTvDetails } = useQuery<IGetMovieCredits>(
    ["movie", "movieCredits"],
    () => getMovieCredits(queryId)
  );

  const onOverlayClick = () => {
    if (category === "movies") return history.push("/");
    if (category === "tv") return history.push("/tv");
  };

  return (
    <AnimatePresence>
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
              <BigContainer>
                <BigOverview>
                  <span>
                    {details?.release_date
                      ? details?.release_date.slice(0, 4)
                      : null}
                  </span>
                  <span>
                    {details?.runtime ? Math.floor(details?.runtime / 60) : 0}h
                    {details?.runtime ? details?.runtime % 60 : 0}m
                  </span>
                  <div>{clickedContent.overview}</div>
                </BigOverview>
                <BigMovieInfo>
                  <li>
                    <span>director:</span>
                    {credits?.crew
                      .filter((c) => c.job === "Director")
                      .map((v) => v.name)
                      .join()}
                  </li>
                  <li>
                    <span>writer:</span>
                    {credits?.crew
                      .filter((v) => v.department === "Writing")
                      .slice(0, 1)
                      .map((v) => v.name)
                      .join()}
                  </li>
                  <li>
                    <span>cast:</span>
                    {credits?.cast
                      .map((actor) => actor.name)
                      .slice(0, 7)
                      .join()}
                  </li>
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
    </AnimatePresence>
  );
}

export default MovieOverlay;
