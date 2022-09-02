import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import NavigationHandler from "./NavigationHandler";
import Home from "./Pages/Home";
import SubPage from "./Pages/SubPage";
const AlbumRatingPage = React.lazy(() => import("./Pages/AlbumRatingPage"));
const ResumePage = React.lazy(() => import("./Pages/ResumePage"));
const GreedyGorillasPage = React.lazy(
  () => import("./Pages/GreedyGorillas/GreedyGorillasPage")
);
const MathSeminarPaper = React.lazy(
  () => import("./Pages/InteractivePapers/MathSeminarPaper/MathSeminarPaper")
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
const SlidePuzzlePaper = React.lazy(
  () => import("./Pages/InteractivePapers/SlidePuzzlePaper/SlidePuzzlePaper")
);
const CountdownPage = React.lazy(
  () => import("./Pages/Countdown/CountdownPage")
);
const WordlePage = React.lazy(() => import("./Pages/Wordle/WordlePage"));
const FFFdlePage = React.lazy(() => import("./Pages/Wordle/FFFdle"));

const Page: React.FC<{
  title: string;
  children: React.ReactElement;
}> = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return children;
};

let App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavigationHandler>
        <Home />
        <SubPage>
          <Suspense fallback={<></>}>
            <Routes>
              <Route
                path="/albums"
                element={
                  <Page title="Luke's Favorite Albums">
                    <AlbumRatingPage />
                  </Page>
                }
              />
              <Route
                path="/resume"
                element={
                  <Page title="Luke's Resume">
                    <ResumePage />
                  </Page>
                }
              />
              <Route
                path="/greedygorillas"
                element={
                  <Page title="Greedy Gorillas">
                    <GreedyGorillasPage />
                  </Page>
                }
              />
              <Route
                path="/informationtheory"
                element={<Navigate to="/cowsandbulls" />}
              />
              <Route
                path="/cowsandbulls"
                element={
                  <Page title="Cows, Bulls, and Beyond">
                    <MathSeminarPaper />
                  </Page>
                }
              />
              <Route
                path="/muchumme"
                element={
                  <Page title="Muchumme">
                    <Muchumme />
                  </Page>
                }
              />
              <Route
                path="/lasagna-friendship"
                element={
                  <Page title="Lasagna-Friendship">
                    <LasagnaFriendship />
                  </Page>
                }
              />
              <Route
                path="/slide"
                element={
                  <Page title="Slide Puzzle">
                    <SlidePuzzlePage />
                  </Page>
                }
              />
              <Route
                path="/webchillian"
                element={
                  <Page title="Webchillian Tip Tip Tip Cheeepeeeee">
                    <WebchillianPage />
                  </Page>
                }
              />
              <Route
                path="/theoryofsliding"
                element={
                  <Page title="Theory of Sliding">
                    <SlidePuzzlePaper />
                  </Page>
                }
              />
              <Route
                path="/countdown"
                element={
                  <Page title="Countdown to...">
                    <CountdownPage />
                  </Page>
                }
              />
              <Route
                path="/wordle"
                element={
                  <Page title="Wordle">
                    <WordlePage />
                  </Page>
                }
              />
              <Route
                path="/444dle"
                element={
                  <Page title="444dle">
                    <FFFdlePage />
                  </Page>
                }
              />
              <Route
                path="/"
                element={
                  <Page title="Luke LaValva">
                    <></>
                  </Page>
                }
              />
              <Route
                path="/*"
                element={
                  <Page title="Luke LaValva - Not Found">
                    <PageNotFound />
                  </Page>
                }
              />
            </Routes>
          </Suspense>
        </SubPage>
      </NavigationHandler>
    </BrowserRouter>
  );
};

export default App;
