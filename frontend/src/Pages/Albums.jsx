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
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import config from "../config";

function Albums() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [country, setCountry] = useState("Iran");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      const url = `${config.API_BASE_URL}/api/albums1/filter/?country=${country}&page=${currentPage}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        setAlbums(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
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

  const handleCardClick = async (artist_name, album_name) => {
    navigate(
      `/album/${encodeURIComponent(artist_name)}/${encodeURIComponent(
        album_name
      )}`
    );
  };

  const capitalizeArtistName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <Container>
      <Row className="my-4">
        <h1 style={{ color: "white" }} className="text-center mt-4 sm-4">
          Albums Dataset
        </h1>
      </Row>
      <Row className="my-3">
        <Col>
          <Form.Select value={country} onChange={handleCountryChange}>
            <option value="India">India</option>
            <option value="Iran">Iran</option>
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
          {albums.map((album, index) => (
            <Col key={index} md={4}>
              <Card
                className="mb-3"
                onClick={() =>
                  handleCardClick(album.artist_name, album.album_name)
                }
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <Card.Title
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {album.album_name}
                  </Card.Title>
                  <Card.Subtitle>
                    {capitalizeArtistName(album.artist_name)}
                  </Card.Subtitle>
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

export default Albums;
