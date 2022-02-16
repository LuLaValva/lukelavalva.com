import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NavigationHandler from "./NavigationHandler";
import Home from "./Pages/Home";
import SubPage from "./Pages/SubPage";
import AlbumRatingPage from "./Pages/AlbumRatingPage";
import ResumePage from "./Pages/ResumePage";
import GreedyGorillasPage from "./GreedyGorillas/GreedyGorillasPage";
import MathSeminarPaper from "./Pages/MathSeminarPaper/MathSeminarPaper";

let App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavigationHandler>
        <Home />
        <SubPage>
          <Switch>
            <Route path="/albums" component={AlbumRatingPage} />
            <Route path="/resume" component={ResumePage} />
            <Route path="/greedygorillas" component={GreedyGorillasPage} />
            <Route path="/informationtheory" component={MathSeminarPaper} />
          </Switch>
        </SubPage>
      </NavigationHandler>
    </BrowserRouter>
  );
};

export default App;
