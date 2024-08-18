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
  Overlay,
} from "./SliderRow";
import { useRecoilState } from "recoil";
import { paramIdState } from "../atoms";
import { useQuery } from "react-query";

function TvOverlay(props: {
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

  const { data: details, isLoading: isTvDetails } = useQuery<IGetTvDetails>(
    ["tv", "tvDetails"],
    () => getTvDetails(queryId)
  );
  console.log("tvDetails", details);

  const { data: credits, isLoading: isTvCredits } = useQuery<IGetMovieCredits>(
    ["tv", "tvCredits"],
    () => getTvCredits(queryId)
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
                  <span>{details?.first_air_date.slice(0, 4)}</span>

                  <span>{details?.number_of_seasons}seasons</span>
                  <div>{clickedContent.overview}</div>
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
