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
  getTvCredits,
  getTvDetails,
  IGetMovieCredits,
  IGetTvDetails,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { paramIdState } from "../atoms";
import { useRecoilState } from "recoil";

function TvSearchOverlay(props: {
  keyword: string;
  id: string;
  scrollY: any;
  clickedContent: IMovie | null;
}) {
  const { keyword, id, scrollY, clickedContent } = props;
  const history = useHistory();
  const onOverlayClick = () => {
    history.push(`/search?keyword=${keyword}`);
  };
  const [queryId, setQueryId] = useRecoilState(paramIdState);

  const { data: details, isLoading: isTvDetails } = useQuery<IGetTvDetails>(
    ["tv", "tvDetails"],
    () => getTvDetails(queryId)
  );
  console.log("tvDetails", details);

  const { data: credits, isLoading: isTvCredits } = useQuery<IGetMovieCredits>(
    ["tv", "tvCredits"],
    () => getTvCredits(queryId)
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
                <span>
                  {details?.first_air_date
                    ? details?.first_air_date.slice(0, 4)
                    : null}
                </span>

                <span>
                  {details?.number_of_seasons
                    ? details?.number_of_seasons
                    : null}
                  seasons
                </span>
                <div>
                  {clickedContent.overview ? clickedContent.overview : null}
                </div>
              </BigOverview>
              <BigMovieInfo>
                {credits?.crew && credits?.crew.length ? (
                  <li>
                    <span>director:</span>
                    {credits?.crew
                      .filter((c) => c.job === "Director")
                      .map((v) => v.name)
                      .join()}
                  </li>
                ) : null}
                {credits?.crew && credits?.crew.length ? (
                  <li>
                    <span>writer:</span>
                    {credits?.crew
                      .filter((v) => v.department === "Writing")
                      .slice(0, 1)
                      .map((v) => v.name)
                      .join()}
                  </li>
                ) : null}
                {credits?.cast && credits?.cast.length ? (
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
                  {details?.genres
                    ? details?.genres.map((v) => v.name).join()
                    : null}
                </li>
              </BigMovieInfo>
            </BigContainer>
          </>
        ) : null}
      </BigMovie>
    </AnimatePresence>
  );
}

export default TvSearchOverlay;
