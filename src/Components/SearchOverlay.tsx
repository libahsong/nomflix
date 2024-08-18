import { useHistory } from "react-router-dom";
import {
  BigContainer,
  BigCover,
  BigMovie,
  BigMovieInfo,
  BigOverview,
  BigTitle,
  Overlay,
} from "./SliderRow";
import {
  getMovieCredits,
  getMovieDetails,
  IGetMovieCredits,
  IGetMovieDetails,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { paramIdState } from "../atoms";

function SearchOverlay(props: {
  keyword: string;
  id: string;
  scrollY: any;
  clickedContent: IMovie | null;
}) {
  const { keyword, id, scrollY, clickedContent } = props;
  const [queryId, setQueryId] = useRecoilState(paramIdState);
  const history = useHistory();
  const onOverlayClick = () => {
    // if (category === "movies") return history.push("/");
    // if (category === "tv") return history.push("/tv");
    history.push(`/search?keyword=${keyword}`);
  };
  const { data: details, isLoading: isMovieDetails } =
    useQuery<IGetMovieDetails>(["movie", "movieDetails"], () =>
      getMovieDetails(queryId)
    );
  const { data: credits, isLoading: isTvDetails } = useQuery<IGetMovieCredits>(
    ["movie", "movieCredits"],
    () => getMovieCredits(queryId)
  );

  return (
    <AnimatePresence>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0, transition: { type: "linear", duration: 0.5 } }}
        animate={{ opacity: 1, transition: { type: "linear", duration: 0.5 } }}
      />
      <BigMovie
        // layoutId={urlMatch.params.movieId}
        // layoutId={id}
        animate={{ opacity: 1, transition: { type: "linear", duration: 0.5 } }}
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
              {clickedContent.title
                ? clickedContent.title
                : clickedContent.name}
            </BigTitle>
            <BigContainer>
              <BigOverview>
                <span>{details?.release_date.slice(0, 4)}</span>
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
                    ? credits?.crew
                        .filter((c) => c.job === "Director")
                        .map((v) => v.name)
                        .join()
                    : null}
                </li>
                <li>
                  <span>writer:</span>
                  {credits?.crew
                    ? credits?.crew
                        .filter((v) => v.department === "Writing")
                        .slice(0, 1)
                        .map((v) => v.name)
                        .join()
                    : null}
                </li>
                <li>
                  <span>cast:</span>
                  {credits?.cast
                    ? credits?.cast
                        .map((actor) => actor.name)
                        .slice(0, 7)
                        .join()
                    : null}
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
    </AnimatePresence>
  );
}

export default SearchOverlay;
