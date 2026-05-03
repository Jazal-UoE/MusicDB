import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import stringSimilarity from "string-similarity";

// const YOUTUBE_API_KEY = "";
// const SPOTIFY_CLIENT_ID = "";
// const SPOTIFY_CLIENT_SECRET = "";


function SongDetail() {
  const { artistName, songName } = useParams();
  const navigate = useNavigate();
  const [videoId, setVideoId] = useState(null);
  const [spotifyData, setSpotifyData] = useState(null);
  const [spotifyTrackData, setSpotifyTrackData] = useState(null);
  const [spotifyAudioFeatures, setSpotifyAudioFeatures] = useState(null);
  const [songDetails, setSongDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            songName
          )}+song+${encodeURIComponent(
            artistName
          )}&type=video&key=${YOUTUBE_API_KEY}&maxResults=1`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.items.length > 0) {
          const video = data.items[0];
          const videoTitle = video.snippet.title.toLowerCase();
          const songNameLower = songName.toLowerCase();

          if (!videoTitle.includes(songNameLower)) {
            setError(
              "No video found on YouTube with a high degree of similarity"
            );
            return;
          }

          setVideoId(video.id.videoId);
        } else {
          setError("No video found on YouTube");
        }
      } catch (error) {
        setError(error.message);
      }
    }

    async function fetchSpotifyToken() {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
          },
          body: "grant_type=client_credentials",
        }
      );
      const tokenData = await tokenResponse.json();
      return tokenData.access_token;
    }

    async function fetchSpotifyData(token) {
      try {
        const searchQuery = `${encodeURIComponent(
          songName
        )} ${encodeURIComponent(artistName)}`;
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${searchQuery}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Spotify API response was not ok");
        }
        const data = await response.json();

        if (data.tracks.items.length > 0) {
          const track = data.tracks.items[0];

          const similarity = stringSimilarity.compareTwoStrings(
            songName.toLowerCase(),
            track.name.toLowerCase()
          );
          if (similarity < 0.5) {
            setError(
              "No song found on Spotify with a high degree of similarity"
            );
            return;
          }

          setSpotifyData(track);

          const trackResponse = await fetch(
            `https://api.spotify.com/v1/tracks/${track.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const trackData = await trackResponse.json();
          setSpotifyTrackData(trackData);

          const audioFeaturesResponse = await fetch(
            `https://api.spotify.com/v1/audio-features/${track.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const audioFeaturesData = await audioFeaturesResponse.json();
          setSpotifyAudioFeatures(audioFeaturesData);
        } else {
          setError("No song found on Spotify");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchSongDetails() {
      try {
        const url = `http://localhost:8000/api/song5/details/?song_name=${encodeURIComponent(
          songName
        )}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Error fetching song details");
        }
        const data = await response.json();
        setSongDetails(data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchVideo();
    fetchSpotifyToken()
      .then((token) => fetchSpotifyData(token))
      .catch((error) => {
        setError(error.message);
      });
    fetchSongDetails();
  }, [artistName, songName]);

  const handleDiscoverMore = () => {
    navigate(`/top-n?song_name=${encodeURIComponent(songName)}`);
  };

  const linkStyle = { color: "white", textDecoration: "none" };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={10}>
          <Card className="my-4 bg-dark text-white">
            <Card.Body className="text-center">
              <h1 className="display-4">{songName}</h1>
              <p className="lead">by {artistName}</p>
            </Card.Body>
          </Card>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {songDetails && (
            <Card className="mb-4" bg="secondary" text="white">
              <Card.Body>
                <Card.Title>Song Contributors</Card.Title>
                <Card.Text>
                  <strong>Composer:</strong>{" "}
                  <Link
                    to={`/artist/${encodeURIComponent(
                      songDetails.composer_name
                    )}`}
                    style={linkStyle}
                  >
                    {songDetails.composer_name}
                  </Link>
                </Card.Text>
                <Card.Text>
                  <strong>Lyricist:</strong>{" "}
                  <Link
                    to={`/artist/${encodeURIComponent(
                      songDetails.lyricist_name
                    )}`}
                    style={linkStyle}
                  >
                    {songDetails.lyricist_name}
                  </Link>
                </Card.Text>
                <Card.Text>
                  <strong>Tuner:</strong>{" "}
                  <Link
                    to={`/artist/${encodeURIComponent(
                      songDetails.tuning_name
                    )}`}
                    style={linkStyle}
                  >
                    {songDetails.tuning_name}
                  </Link>
                </Card.Text>
                <Card.Text>
                  <strong>Artist:</strong>{" "}
                  <Link
                    to={`/artist/${encodeURIComponent(
                      songDetails.artist_name
                    )}`}
                    style={linkStyle}
                  >
                    {songDetails.artist_name}
                  </Link>
                </Card.Text>
                <Button variant="primary" onClick={handleDiscoverMore}>
                  Discover More
                </Button>
              </Card.Body>
            </Card>
          )}

          {videoId ? (
            <div className="text-center mb-4">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            </div>
          ) : (
            !error && <p className="text-center">Loading YouTube video...</p>
          )}

          {spotifyData && (
            <div className="text-center mb-4">
              <iframe
                src={`https://open.spotify.com/embed/track/${spotifyData.id}`}
                width="100%"
                height="80"
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media"
                title="Spotify Player"
              ></iframe>
            </div>
          )}
        </Col>
      </Row>

      {spotifyData && spotifyTrackData && spotifyAudioFeatures && (
        <Row className="justify-content-md-center">
          <Col md={10}>
            <Card
              className="mt-4"
              style={{ backgroundColor: "#1DB954", color: "white" }}
            >
              <Card.Body>
                <Card.Title>Spotify Metadata</Card.Title>
                <Card.Text>
                  <strong>Track:</strong> {spotifyData.name}
                </Card.Text>
                <Card.Text>
                  <strong>Artist:</strong>{" "}
                  {spotifyData.artists
                    .map((artist) => (
                      <Link
                        to={`/artist/${encodeURIComponent(artist.name)}`}
                        key={artist.id}
                        style={linkStyle}
                      >
                        {artist.name}
                      </Link>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr])}
                </Card.Text>
                <Card.Text>
                  <strong>Album:</strong> {spotifyData.album.name}
                </Card.Text>
                <Card.Text>
                  <strong>Release Date:</strong>{" "}
                  {spotifyData.album.release_date}
                </Card.Text>
                <Card.Text>
                  <strong>Popularity:</strong> {spotifyData.popularity}
                </Card.Text>
                <Card.Text>
                  <strong>Duration:</strong>{" "}
                  {Math.floor(spotifyTrackData.duration_ms / 60000)}:
                  {((spotifyTrackData.duration_ms % 60000) / 1000).toFixed(0)}
                </Card.Text>
                <Card.Text>
                  <strong>Explicit:</strong>{" "}
                  {spotifyTrackData.explicit ? "Yes" : "No"}
                </Card.Text>
                <Card.Text>
                  <strong>Danceability:</strong>{" "}
                  {spotifyAudioFeatures.danceability}
                </Card.Text>
                <Card.Text>
                  <strong>Energy:</strong> {spotifyAudioFeatures.energy}
                </Card.Text>
                <Card.Text>
                  <strong>Key:</strong> {spotifyAudioFeatures.key}
                </Card.Text>
                <Card.Text>
                  <strong>Loudness:</strong> {spotifyAudioFeatures.loudness}
                </Card.Text>
                <Card.Text>
                  <strong>Speechiness:</strong>{" "}
                  {spotifyAudioFeatures.speechiness}
                </Card.Text>
                <Card.Text>
                  <strong>Acousticness:</strong>{" "}
                  {spotifyAudioFeatures.acousticness}
                </Card.Text>
                <Card.Text>
                  <strong>Instrumentalness:</strong>{" "}
                  {spotifyAudioFeatures.instrumentalness}
                </Card.Text>
                <Card.Text>
                  <strong>Liveness:</strong> {spotifyAudioFeatures.liveness}
                </Card.Text>
                <Card.Text>
                  <strong>Valence:</strong> {spotifyAudioFeatures.valence}
                </Card.Text>
                <Card.Text>
                  <strong>Tempo:</strong> {spotifyAudioFeatures.tempo}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default SongDetail;
