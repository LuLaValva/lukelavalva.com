import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  RouteProps,
  Redirect,
} from "react-router-dom";

import NavigationHandler from "./NavigationHandler";
import Home from "./Pages/Home";
import SubPage from "./Pages/SubPage";
const AlbumRatingPage = React.lazy(() => import("./Pages/AlbumRatingPage"));
const ResumePage = React.lazy(() => import("./Pages/ResumePage"));
const GreedyGorillasPage = React.lazy(
  () => import("./GreedyGorillas/GreedyGorillasPage")
);
const MathSeminarPaper = React.lazy(
  () => import("./Pages/MathSeminarPaper/MathSeminarPaper")
);
const Muchumme = React.lazy(() => import("./Pages/Muchumme/Muchumme"));
const SlidePuzzlePage = React.lazy(
  () => import("./Pages/SlidePuzzle/SlidePuzzlePage")
);
const PageNotFound = React.lazy(() => import("./Pages/PageNotFound"));
const LasagnaFriendship = React.lazy(
  () => import("./Pages/LasagnaFriendship/LasagnaFriendship")
);
const WebchillianPage = React.lazy(
  () => import("./Pages/Webchillian/WebchillianPage")
);

interface PageProps extends RouteProps {
  title: string;
}

const Page: React.FC<PageProps> = ({ title, ...rest }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return <Route {...rest} />;
};

let App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavigationHandler>
        <Home />
        <SubPage>
          <Suspense fallback={<></>}>
            <Switch>
              <Page
                path="/albums"
                component={AlbumRatingPage}
                title="Luke's Favorite Albums"
              />
              <Page
                path="/resume"
                component={ResumePage}
                title="Luke's Resume"
              />
              <Page
                path="/greedygorillas"
                component={GreedyGorillasPage}
                title="Greedy Gorillas"
              />
              <Route
                path="/informationtheory"
                component={() => <Redirect to="/cowsandbulls" />}
              />
              <Page
                path="/cowsandbulls"
                component={MathSeminarPaper}
                title="Cows, Bulls, and Beyond"
              />
              <Page path="/muchumme" component={Muchumme} title="Muchumme" />
              <Page
                path="/lasagna-friendship"
                component={LasagnaFriendship}
                title="Lasagna-Friendship"
              />
              <Page
                path="/slide"
                component={SlidePuzzlePage}
                title="Slide Puzzle"
              />
              <Page
                path="/webchillian"
                component={WebchillianPage}
                title="Webchillian Tip Tip Tip Cheeepeeeee"
              />
              <Page exact path="/" title="Luke LaValva" />
              <Page component={PageNotFound} title="Luke LaValva - Not Found" />
            </Switch>
          </Suspense>
        </SubPage>
      </NavigationHandler>
    </BrowserRouter>
  );
};

export default App;
