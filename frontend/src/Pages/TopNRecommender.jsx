import React, { useState, useEffect } from "react";

import {
  Container,
  Form,
  ListGroup,
  Accordion,
  Button,
  Spinner,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import config from "../config";

function TopNRecommender() {
  const [songName, setSongName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const location = useLocation();

  const getQueryStringValue = (key) => {
    return new URLSearchParams(location.search).get(key);
  };

  useEffect(() => {
    const querySongName = getQueryStringValue("song_name");
    if (querySongName) {
      setSongName(querySongName);
      console.log(querySongName);
      fetchRecommendations(querySongName);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (songName.length > 2 && isTyping) {
        try {
          const response = await fetch(
            `${
              config.API_BASE_URL
            }/api/songs2/search/?query=${encodeURIComponent(songName)}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();

          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timerId = setTimeout(() => fetchSuggestions(), 500);
    return () => clearTimeout(timerId);
  }, [songName, isTyping]);

  const fetchRecommendations = async (songNameParam) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          config.API_BASE_URL
        }/api/recommendations/?song_name=${encodeURIComponent(songNameParam)}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setSongName(suggestion);
    setSuggestions([]);
    setIsTyping(false);
  };

  return (
    <Container style={{ marginTop: "12rem", marginBottom: "45rem" }}>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1 className="text-center mb-4" style={{ color: "white" }}>
            Top-N Recommender
          </h1>
          <Form.Group controlId="songName">
            <Form.Control
              type="text"
              value={songName}
              onChange={(e) => {
                setSongName(e.target.value);
                setIsTyping(true);
              }}
              placeholder="Enter a song name..."
            />
            {suggestions.length > 0 && isTyping && (
              <ListGroup>
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="button-tooltip">
                Fetches recommendations based on similarity to the entered song
                name, providing a list of songs that match the criteria.
              </Tooltip>
            }
          >
            <Button
              variant="primary"
              onClick={() => fetchRecommendations(songName)}
              disabled={!songName.trim()}
              className="mb-3"
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </OverlayTrigger>

          {loading && (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          )}
          {!loading && (
            <ListGroup>
              {recommendations.map((rec, index) => (
                <ListGroup.Item key={index}>
                  {rec.song_name} - Composers:{" "}
                  {rec.composers.replace(/, /g, "") || "N/A"}, Lyricists:{" "}
                  {rec.lyricists.replace(/, /g, "") || "N/A"}, Tuning:{" "}
                  {rec.tuning ? rec.tuning.replace(/, /g, "") : "N/A"},
                  Similarity Score:
                  {rec.similarity_score}%
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default TopNRecommender;
