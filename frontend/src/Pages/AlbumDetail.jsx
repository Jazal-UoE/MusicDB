import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

function AlbumDetail() {
  const { artistName, albumName } = useParams();
  const navigate = useNavigate();
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/albums5/details/?album_name=${albumName}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAlbumData(data);
      } catch (error) {
        setError(error.message || "Error fetching album details");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumName]);

  const handleArtistClick = () => {
    navigate(`/artist/${artistName}`);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={10}>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="mt-4">
              {error}
            </Alert>
          )}

          {albumData && (
            <Card className="my-4 bg-dark text-white">
              <Card.Body>
                <h1 className="display-4">{albumData.album_name}</h1>
                <p className="lead">
                  by{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={handleArtistClick}
                  >
                    {artistName}
                  </span>
                </p>
                <Card.Text>
                  <strong>Country:</strong> {albumData.country}
                </Card.Text>
                <Card.Text>
                  <strong>Publisher:</strong> {albumData.publisher}
                </Card.Text>
                <Card.Text>
                  <strong>Year:</strong> {albumData.year}
                </Card.Text>
                <Card.Text>
                  <strong>Description:</strong> {albumData.description}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AlbumDetail;
