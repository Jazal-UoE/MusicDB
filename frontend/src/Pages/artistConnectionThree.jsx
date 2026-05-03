import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ArtistConnectionThree = () => {
  const { artist1, artist2, artist3 } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        console.log(
          `Fetching songs for ${artist1}, ${artist2}, and ${artist3}`
        );
        const response = await fetch(
          `http://localhost:8000/api/artists6/commonSongsForThree/?singer1=${encodeURIComponent(
            artist1
          )}&singer2=${encodeURIComponent(
            artist2
          )}&singer3=${encodeURIComponent(artist3)}`
        );
        console.log("API response status:", response.status);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("API response data:", data);
        setSongs(data.common_songs);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [artist1, artist2, artist3]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );
  }

  const handleArtistClick = (artistName) => {
    navigate(`/artist/${artistName}`);
  };

  const handleSongClick = (songName) => {
    navigate(`/song/${artist1}/${songName}`);
  };

  return (
    <div className="container mt-5">
      <style>
        {`
          .highlight {
            background-color: #d1ecf1;
          }
          .custom-title {
            font-size: 2.5rem;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 4px #000000;
            text-transform: uppercase;
          }
          .statistics-container {
            background-color: #343a40;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      <h1 className="mb-4 text-center custom-title">
        Collaborations: {artist1.toUpperCase()}, {artist2.toUpperCase()}, and{" "}
        {artist3.toUpperCase()}
      </h1>
      <table className="table table-hover table-bordered table-responsive">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Song</th>
            <th scope="col">Artists</th>
            <th scope="col">Composers</th>
            <th scope="col">Lyricists</th>
            <th scope="col">Tuners</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index}>
              <td
                className="clickable"
                onClick={() => handleSongClick(song.song_name)}
                style={{ cursor: "pointer" }}
              >
                {song.song_name}
              </td>
              <td>
                {song.metadata.artists.map((artist, idx) => (
                  <span
                    key={idx}
                    className={`badge badge-primary text-dark mr-1 ${
                      artist.toLowerCase() === artist1.toLowerCase() ||
                      artist.toLowerCase() === artist2.toLowerCase() ||
                      artist.toLowerCase() === artist3.toLowerCase()
                        ? "highlight"
                        : ""
                    } clickable`}
                    onClick={() => handleArtistClick(artist)}
                    style={{ cursor: "pointer" }}
                  >
                    {artist}
                  </span>
                ))}
              </td>
              <td>
                {song.metadata.composers.map((composer, idx) => (
                  <span
                    key={idx}
                    className={`badge badge-success text-dark mr-1 ${
                      composer.toLowerCase() === artist1.toLowerCase() ||
                      composer.toLowerCase() === artist2.toLowerCase() ||
                      composer.toLowerCase() === artist3.toLowerCase()
                        ? "highlight"
                        : ""
                    } clickable`}
                    onClick={() => handleArtistClick(composer)}
                    style={{ cursor: "pointer" }}
                  >
                    {composer}
                  </span>
                ))}
              </td>
              <td>
                {song.metadata.lyricists.map((lyricist, idx) => (
                  <span
                    key={idx}
                    className={`badge badge-warning text-dark mr-1 ${
                      lyricist.toLowerCase() === artist1.toLowerCase() ||
                      lyricist.toLowerCase() === artist2.toLowerCase() ||
                      lyricist.toLowerCase() === artist3.toLowerCase()
                        ? "highlight"
                        : ""
                    } clickable`}
                    onClick={() => handleArtistClick(lyricist)}
                    style={{ cursor: "pointer" }}
                  >
                    {lyricist}
                  </span>
                ))}
              </td>
              <td>
                {song.metadata.tuners.map((tuner, idx) => (
                  <span
                    key={idx}
                    className={`badge badge-info text-dark mr-1 ${
                      tuner.toLowerCase() === artist1.toLowerCase() ||
                      tuner.toLowerCase() === artist2.toLowerCase() ||
                      tuner.toLowerCase() === artist3.toLowerCase()
                        ? "highlight"
                        : ""
                    } clickable`}
                    onClick={() => handleArtistClick(tuner)}
                    style={{ cursor: "pointer" }}
                  >
                    {tuner}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="mt-3 text-center statistics-container">
        <h4>Total Songs: {songs.length}</h4>
      </div> */}
    </div>
  );
};

export default ArtistConnectionThree;
