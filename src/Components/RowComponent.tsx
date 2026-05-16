import { useRecoilState } from "recoil";
import { makeImagePath } from "../utils";
import { Box, Info, Row } from "./SliderRow";
import { paramIdState } from "../atoms";
import { useHistory } from "react-router-dom";
import { IGetMovieResult } from "../api";

const offset = 6;

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),

  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),

  exitOnce: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
};
const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.2,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};
function RowComponent(props: {
  data: IGetMovieResult;
  back: boolean;
  index: number;
  title: string;
  category: string;
}) {
  const { data, back, index, title, category } = props;
  console.log("back", back, "category", category, "index", index);

  const [queryId, setQueryId] = useRecoilState(paramIdState);
  const history = useHistory();
  const onBoxClicked = (movieId: number, title: string, category: string) => {
    if (category === "movies") {
      setQueryId(+movieId);
      history.push(`/movies/${title}/${movieId}`);
    } else if (category === "tv") {
      setQueryId(+movieId);
      history.push(`/tv/${title}/${movieId}`);
    }
  };
  return (
    <Row
      $movies={data?.results.length}
      custom={back}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: "tween", duration: 0.5 }}
      key={index + title}
      id={index + ""}
    >
      {data?.results
        .slice(1)
        .slice(offset * index, offset * index + offset)
        .map((movie) => (
          <Box
            key={movie.id + title}
            layoutId={movie.id + title}
            variants={boxVariants}
            initial="normal"
            whileHover="hover"
            transition={{ type: "tween" }}
            $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
            // $bgPhoto={makeImagePath(movie.poster_path, "w500")}
            onClick={() => onBoxClicked(movie.id, title, category)}
          >
            <Info variants={infoVariants}>
              <h4>{category === "movies" ? movie.title : movie.name}</h4>
            </Info>
          </Box>
        ))}
    </Row>
  );
}
export default RowComponent;
