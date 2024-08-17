import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import Home from "./Routes/Home";
import Tv from "./Routes/TV";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <Router>
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
      </Router>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </>
  );
}

export default App;
