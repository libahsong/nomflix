import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { IGetMovieResult } from "../api";
import { makeImagePath } from "../utils";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { categoryState } from "../atoms";
import { Category, titleList } from "./SliderRow";

const Rows = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 4vw 0px;
  grid-template-columns: repeat(6, 1fr);
  /* position: absolute; */
  /* overflow: hidden; */
  line-height: 1.6;
  margin-top: 10px;
  /* position: relative; */
  /* height: 170px; */
  /* z-index: 1; */
  /* box-sizing: border-box; */
`;
const BoxMask = styled.div`
  padding: 0px 0.2vw;
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  /* z-index: 0; */
  background-color: white;
  /* height: 166px; */
  /* position: relative; */
  width: 100%;
  height: 0;
  padding: 28.125% 0;
  /* padding: 0px 0.2vw; */
  /* height: 100%; */
  /* padding: 28.5% 0; */
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  /* background-size: contain; */
  background-repeat: no-repeat;
  background-position: center;
  font-size: 66px;
  cursor: pointer;
  /* &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  } */
  border-radius: 5px;
  /* position: absolute; */
  //display: inline-block;
  //width: 330px;
  /* box-sizing: border-box; */
  /* overflow-y: hidden; */

  img {
    width: 100%;
    position: absolute;
    object-fit: fill;
    /* height: 100%; */
  }
`;

const Keywords = styled.div`
  line-height: 1.6;
  display: flex;
  /* display: inline-block; */
  min-height: 65px;
  width: 100%;
  font-size: 1.5vw;
  span {
    color: rgb(128, 128, 128);
    flex: 0 1 auto;
    margin-right: 5px;
    white-space: nowrap;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0px;
    padding: 0px;
    li {
      flex: 0 1 auto;
      border-right: 1px solid rgb(128, 128, 128);
      list-style: none;
      padding: 0px 0.5em;
      font-weight: 530;
      font-size: calc(1.125vw);
    }
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  /* background-color: rgba(170, 166, 166, 0.5); */
  border-radius: 3px;
  color: #ece4e4;
  font-weight: 600;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    // zIndex: 2,
    // y: -50,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};

function SearchRow(props: {
  keyword: string;
  data: IGetMovieResult;
  category: string;
}) {
  const { keyword, data, category } = props;
  // console.log(data);
  const history = useHistory();
  const setCategory = useSetRecoilState(categoryState);
  // const [categoryAtom, setCategory] = useRecoilState(categoryState);

  const onBoxClicked = (movieId: number, keyword: string) => {
    // if (category === "movies") {
    //   history.push(`/movies/${title}/${movieId}`);
    // } else if (category === "tv") {
    //   history.push(`/tv/${title}/${movieId}`);
    // }
    // history.push(`/search/${keyword}/${movieId}`);
    console.log("onBoxClicked category", category);

    setCategory(category);
    history.push(`/search?keyword=${keyword}&movieId=${movieId}`);
  };

  return (
    <>
      <Category>{titleList[category]}</Category>
      <Rows
        key={keyword}
        // id={index + ""}
      >
        {data?.results
          // .slice(1)
          // .slice(offset * index, offset * index + offset)
          .map((movie) => (
            <BoxMask>
              <Box
                key={movie.id}
                layoutId={movie.id + ""}
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
                $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                // $bgPhoto={makeImagePath(movie.poster_path, "w500")}
                onClick={() => onBoxClicked(movie.id, keyword as any)}
              >
                {/* <img src={makeImagePath(movie.poster_path, "w500")} /> */}
                <Info variants={infoVariants}>
                  <h4>{category === "movies" ? movie.title : movie.name}</h4>
                </Info>
              </Box>
            </BoxMask>
          ))}
      </Rows>
    </>
  );
}

export default SearchRow;
