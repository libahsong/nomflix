import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { hoverState } from "../atoms";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  background-color: black;
  color: white;
  font-size: 16px;
  padding: 20px 60px;
  z-index: 5;
  /* background-color: transparent; */
`;

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke: red;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: ${(props) => props.theme.white.darker};
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: -5px;
  background-color: ${(props) => props.theme.red};
`;

const Col = styled.div`
  display: flex;
  align-items: center;
  z-index: -2;
`;

const SearchItems = styled(motion.div)`
  transform-origin: right center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* position: relative; */
  z-index: -2;
  width: 33vh;
  height: 4vh;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const SearchIcon = styled(motion.svg)`
  height: 3.9vh;
  padding: 5px 5px;
  z-index: 2;
  margin: 0 auto;
`;

const Search = styled(motion.form)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled(motion.input)`
  /* transform-origin: right center; */
  /* right: 0; */
  z-index: 1;
  color: white;
  font-size: 16px;
  background: transparent;
  border: none;
  outline: none;
  width: 32vh;
  height: 3.8vh;
  padding: 0 40px;
`;
const Close = styled(motion.svg)`
  height: 3.9vh;
  padding: 10px 10px;
  /* width: 10px; */
  /* height: 10px; */
  cursor: pointer;
  margin: 0 auto;
  z-index: 2;
`;
const logoVariants = {
  normal: { fillOpacity: 1 },
  active: { fillOpacity: [0, 1, 0], transition: { repeat: Infinity } },
};

const navVariants = {
  // top: { backgroundColor: "rgba(0,0,0,0)" },
  top: { backgroundColor: "transparent" },
  scroll: { backgroundColor: "rgba(0,0,0,1)" },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [closeButton, setCloseButton] = useState(false);
  const [hovering, setHovering] = useRecoilState(hoverState);
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();
  const history = useHistory();
  const { register, handleSubmit, setFocus, setValue, getValues } =
    useForm<IForm>();

  const onValid = (data: IForm) => {
    // console.log("onValid", data);

    // history.push(`/search?keyword=${data.keyword}`);
    history.push(`/search?keyword=${data.keyword}`);
  };

  const toggleSearch = () => {
    // console.log("searchOpen", searchOpen);
    setCloseButton(false);
    if (searchOpen) {
      inputAnimation.start({ scaleX: 0 });
    } else {
      inputAnimation.start({
        scaleX: 1,
        backgroundColor: "rgba(0,0,0,1)",
      });
      setFocus("keyword");
    }
    setSearchOpen((prev) => !prev);
  };

  const closeClick = () => {
    setValue("keyword", "");
    setCloseButton(false);
    setFocus("keyword");
    history.push("/");
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    // console.log("Page scroll: ", latest);
    if (scrollY.get() > 80) {
      navAnimation.start("scroll");
    } else {
      navAnimation.start("top");
    }
  });

  return (
    <Nav
      // style={{ zIndex: hovering ? 3 : 5 }}
      variants={navVariants}
      animate={navAnimation}
      initial={"top"}
    >
      <Col>
        <Link to="/">
          <Logo
            variants={logoVariants}
            animate="normal"
            whileHover="active"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
          </Logo>
        </Link>
        <Items>
          <Item>
            <Link to="/">
              Home
              {homeMatch?.isExact && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/tv">
              Tv Shows
              {tvMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search
          // onChange={handleSubmit(onValid)}
          onKeyUp={handleSubmit(onValid)}
          onSubmit={handleSubmit(onValid)}
        >
          <SearchIcon
            onClick={toggleSearch}
            initial={{ x: 220 }}
            animate={{
              x: searchOpen ? 30 : 220,
              background: searchOpen ? "black" : "transparent",
            }}
            transition={{ type: "linear", duration: 0.3 }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </SearchIcon>
          <Input
            {...register("keyword", {
              required: true,
              minLength: 1,
            })}
            transition={{ type: "tween" }}
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
            placeholder="Search for movie or tv show..."
            onKeyUp={() => {
              setCloseButton(true);
              const { keyword } = getValues();
              if (keyword === "") {
                setCloseButton(false);
                history.push("/");
              }
            }}
            onClick={() => {
              setFocus("keyword");
            }}
            onBlur={() => {
              const { keyword } = getValues();
              if (keyword !== "") {
                return;
              } else {
                toggleSearch();
              }
            }}
          />
        </Search>
        <Close
          onClick={closeClick}
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: closeButton ? 1 : 0,
            x: -25,
            background: "black",
          }}
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
        </Close>
      </Col>
    </Nav>
  );
}
export default Header;
