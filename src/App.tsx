import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

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

let App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavigationHandler>
        <Home />
        <SubPage>
          <Suspense fallback={<></>}>
            <Switch>
              <Route path="/albums" component={AlbumRatingPage} />
              <Route path="/resume" component={ResumePage} />
              <Route path="/greedygorillas" component={GreedyGorillasPage} />
              <Route path="/informationtheory" component={MathSeminarPaper} />
              <Route path="/muchumme" component={Muchumme} />
              <Route path="/slide" component={SlidePuzzlePage} />
              <Route exact path="/" />
              <Route component={PageNotFound} />
            </Switch>
          </Suspense>
        </SubPage>
      </NavigationHandler>
    </BrowserRouter>
  );
};

export default App;
