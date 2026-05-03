import React from "react";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useState } from "react";

import NavScrollExample from "./Components/Header";
import DebugTest from "./Pages/DebugTest";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Home from "./Pages/Home";
import Artists from "./Pages/Artists";
import Songs from "./Pages/Songs";
import TopNRecommender from "./Pages/TopNRecommender";
import ArtistDetail from "./Pages/ArtistDetail";
import SongDetail from "./Pages/SongDetail";
import AlbumDetail from "./Pages/AlbumDetail";
import Footer from "./Components/Footer";
import ArtistConnection from "./Pages/artistConnection";
import { Routes, Route } from "react-router";
import { Navigate } from "react-router";
import Albums from "./Pages/Albums";
import ArtistConnectionThree from "./Pages/artistConnectionThree";
function App() {
  return (
    <>
      <NavScrollExample />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/top-n" element={<TopNRecommender />} />
        <Route path="/artist/:artistName" element={<ArtistDetail />} />

        <Route path="/song/:artistName/:songName" element={<SongDetail />} />
        <Route path="/album/:artistName/:albumName" element={<AlbumDetail />} />
        <Route path="/debug" element={<DebugTest />} />
        <Route
          path="/artistConnection/:artist1/:artist2"
          element={<ArtistConnection />}
        />
        <Route
          path="/artistConnectionThree/:artist1/:artist2/:artist3"
          element={<ArtistConnectionThree />}
        />
        {/* Redirect from root to /home */}
        <Route path="/" element={<Navigate replace to="/home" />} />
      </Routes>
      <Footer />

      {/* <ThemeSwitcher /> */}
    </>
  );
}

function test() {}

export default App;
