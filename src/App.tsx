import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NavigationHandler from "./NavigationHandler";
import Home from "./Pages/Home";
import SubPage from "./Pages/SubPage";
import AlbumRatingPage from "./Pages/AlbumRatingPage";

let App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavigationHandler>
        <Home />
        <SubPage>
          <Switch>
            <Route path="/albums" component={AlbumRatingPage} />
          </Switch>
        </SubPage>
      </NavigationHandler>
    </BrowserRouter>
  );
};

export default App;
