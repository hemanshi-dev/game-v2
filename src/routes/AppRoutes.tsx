import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Home from "../pages/Home";
import Recent from "../pages/Recent";
import Categories from "../pages/Categories";
import Trending from "../pages/Trending";
import Search from "../pages/Search";
import Game from "../pages/Game";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<PageContainer />}>
          <Route path="/" element={<Home />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<Categories />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/category/:slug" element={<Categories />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
