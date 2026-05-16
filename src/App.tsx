import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
} from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import Home from "./Routes/Home";
import Tv from "./Routes/TV";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        {/* <Router> */}
        {/* <HashRouter> */}
        <Header />
        <Switch>
          <Route path={["/tv", "/tv/:title/:movieId"]}>
            <Tv />
          </Route>
          <Route path={["/search", "/search/:q/:movieId"]}>
            <Search />
          </Route>
          <Route path={["/", "/movies/:title/:movieId"]}>
            <Home />
          </Route>
        </Switch>
        <Footer />
      </Router>
      {/* </HashRouter> */}
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </>
  );
}

export default App;
