import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/Home/Home";
import Details from "../pages/details/Details";
import Explore from "../pages/explore/Explore";
import PageNotFound from "../pages/404/PageNotFount";
import SearchResults from "../pages/searchResults/SearchResults";
import PersonBanner from "../pages/person/personBanner/PersonBanner";
import Season from "../pages/details/seasonandepisode/Season";
import Episode from "../pages/details/seasonandepisode/Episode";

export default function Router() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/tv/:id/season/:seasonNumber" element={<Season />} />
        <Route
          path="/tv/:id/season/:seasonNumber/episode/:episodeNumber"
          element={<Episode />}
        />
        <Route path="/person/:id" element={<PersonBanner />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="/search?query=:query" element={<SearchResults />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
