import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Pagination,
  Form,
  Spinner,
  Alert,
  Collapse,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SongReportButton from "../Components/SongReportButton";
import config from "../config";

function IranianSongs() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [country, setCountry] = useState("Iran");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);

  const [viewType, setViewType] = useState("songs");
  const [expandedId, setExpandedId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      const url = `${config.API_BASE_URL}/api/songs1/filter/?country=${country}&page=${currentPage}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        console.log(data);
        setSongs(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [currentPage, country]);

  const handleNext = () => {
    if (nextPageUrl) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (previousPageUrl) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    setCurrentPage(1);
  };

  const toggleSongDetails = (id) => {
    // Toggle the expanded state for the clicked song
    if (submitted === false) {
      setExpandedId(expandedId === id ? null : id);
    }
  };

  const navigateToArtistPageIfValid = async (artist_name) => {
    // Your existing logic to fetch artist details and navigate
    try {
      const response = await fetch(
        `${
          config.API_BASE_URL
        }/api/artist/contributors/?artist_name=${encodeURIComponent(
          artist_name
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const hasValidData = Object.values(data.analysis_results).some(
        (section) => section && Object.keys(section).length > 0
      );

      if (hasValidData) {
        const newPath = `/artist/${encodeURIComponent(artist_name)}`;
        navigate(newPath);
      } else {
        console.log("No relevant data found for this artist.");
      }
    } catch (error) {
      console.error("Error fetching artist details:", error);
    }
  };

  const capitalizeArtistName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1 style={{ color: "white" }} className=" text-center mt-4 sm-4">
            Songs Dataset
          </h1>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <Form.Select value={country} onChange={handleCountryChange}>
            <option value="Iran">Iran</option>
            <option value="India">India</option>
            <option value="Turkey">Turkey</option>
          </Form.Select>
        </Col>
      </Row>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {songs.map((song, index) => (
            <Col key={index} md={4}>
              <Card className="mb-3" style={{ cursor: "pointer" }}>
                <Card.Body onClick={() => toggleSongDetails(song.id)}>
                  <Card.Title>{song.song_name}</Card.Title>
                  <Card.Subtitle
                    className="mb-2 text-muted"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the song detail toggle when clicking on the artist name
                      navigateToArtistPageIfValid(song.artist_name);
                    }}
                  >
                    {capitalizeArtistName(song.artist_name)}
                  </Card.Subtitle>
                  <Collapse in={expandedId === song.id}>
                    <div>
                      <Card.Text
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/artist/${encodeURIComponent(song.composer_name)}`
                          );
                        }}
                      >
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Composer: {song.composer_name || "N/A"}
                        </span>
                      </Card.Text>
                      <Card.Text
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/artist/${encodeURIComponent(song.lyricist_name)}`
                          );
                        }}
                      >
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Lyricist: {song.lyricist_name || "N/A"}
                        </span>
                      </Card.Text>
                      <Card.Text
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/artist/${encodeURIComponent(song.tuning_name)}`
                          );
                        }}
                      >
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Tuning: {song.tuning_name || "N/A"}
                        </span>
                      </Card.Text>

                      <Button
                        variant="link"
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the song detail collapse when clicking the link
                          navigate(
                            `/top-n?song_name=${encodeURIComponent(
                              song.song_name
                            )}`
                          );
                        }}
                      >
                        Discover More
                      </Button>
                      {/* "Details" button */}
                      <Button
                        variant="primary"
                        style={{
                          marginLeft: "10px",
                          textDecoration: "none",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the song detail collapse when clicking the link
                          navigate(
                            `/song/${encodeURIComponent(
                              song.artist_name
                            )}/${encodeURIComponent(song.song_name)}`
                          );
                        }}
                      >
                        Details
                      </Button>
                      <SongReportButton
                        songName={song.song_name}
                        setSubmitted={setSubmitted}
                        submitted={submitted}
                      />
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Pagination className="justify-content-center my-4">
        <Pagination.Prev onClick={handlePrevious} disabled={!previousPageUrl} />
        <Pagination.Item>{currentPage}</Pagination.Item>
        <Pagination.Next onClick={handleNext} disabled={!nextPageUrl} />
      </Pagination>
    </Container>
  );
}

export default IranianSongs;
