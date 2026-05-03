import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SongReportButton from "./SongReportButton";
import {
  ButtonGroup,
  Button,
  Row,
  Col,
  Card,
  Container,
  Collapse,
  Table,
} from "react-bootstrap";

const PaginatedColumns = ({
  items,
  itemsPerPage = 9,
  showId = true,
  showDetails = false,
  increasedHeight = false,
  artistName,
  connections,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleCardClick = (itemId, artistNameParam) => {
    if (showId) {
      navigate(
        `/artistConnection/${encodeURIComponent(
          artistNameParam
        )}/${encodeURIComponent(itemId)}`
      );
    } else {
      if (!submitted) {
        setExpandedItemId(expandedItemId === itemId ? null : itemId);
      }
    }
  };

  const getArtistConnections = (id) => ({
    composer: connections?.composer_connections?.[id] || "N/A",
    lyricist: connections?.lyricist_connections?.[id] || "N/A",
    tuner: connections?.tuning_connections?.[id] || "N/A",
  });

  if (showId) {
    return (
      <Container className={increasedHeight ? "mt-2" : ""}>
        <Table striped bordered hover responsive>
          <thead className="thead-dark">
            <tr>
              <th>Rank</th>
              <th>Artist</th>
              <th>Composer</th>
              <th>Lyricist</th>
              <th>Tuner</th>
              <th>No. Connections</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const connections = getArtistConnections(item.id);
              return (
                <tr
                  key={item.id}
                  onClick={() => handleCardClick(item.id, artistName)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1 + currentPage * itemsPerPage}</td>
                  <td>{item.id}</td>
                  <td>{connections.composer}</td>
                  <td>{connections.lyricist}</td>
                  <td>{connections.tuner}</td>
                  <td>{item.value}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <ButtonGroup>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </Button>
        </ButtonGroup>
      </Container>
    );
  }

  const columns = [[], [], []];
  currentItems.forEach((item, index) => {
    columns[index % 3].push(item);
  });

  return (
    <Container className={increasedHeight ? "mt-2" : ""}>
      <Row>
        {columns.map((column, index) => (
          <Col key={index} lg={4} md={6}>
            {column.map((item) => (
              <Card
                key={item.id}
                className="mb-3"
                onClick={() =>
                  handleCardClick(
                    item.id,
                    artistName ? artistName : item.value.artist_name
                  )
                }
                style={{
                  cursor: "pointer",
                  width: expandedItemId === item.id ? "100%" : "auto",
                  transition: "width 0.3s",
                }}
              >
                <Card.Body>
                  <Card.Text
                    style={{
                      whiteSpace:
                        expandedItemId === item.id ? "normal" : "nowrap",
                      overflow:
                        expandedItemId === item.id ? "visible" : "hidden",
                      textOverflow:
                        expandedItemId === item.id ? "clip" : "ellipsis",
                    }}
                  >
                    {showDetails &&
                      ((item.value.composer_name &&
                        item.value.composer_name !== "Unknown") ||
                        (item.value.lyricist_name &&
                          item.value.lyricist_name !== "Unknown") ||
                        (item.value.tuning_name &&
                          item.value.tuning_name !== "Unknown")) &&
                      "🔽 "}
                    {expandedItemId === item.id ||
                    item.value.song_name.length <= 15
                      ? item.value.song_name
                          .replace(/[\{\}\[\],،]/g, " ")
                          .replace(/\s+/g, " ")
                          .trim()
                      : `${item.value.song_name.slice(0, 15)}...`}
                  </Card.Text>
                  <Collapse in={expandedItemId === item.id}>
                    <div>
                      {showDetails && (
                        <>
                          <Card.Text>
                            Composer: {item.value.composer_name || "N/A"}
                          </Card.Text>
                          <Card.Text>
                            Lyricist: {item.value.lyricist_name || "N/A"}
                          </Card.Text>
                          <Card.Text>
                            Tuning: {item.value.tuning_name || "N/A"}
                          </Card.Text>
                          <Button
                            variant="link"
                            style={{
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/top-n?song_name=${encodeURIComponent(
                                  item.value.song_name
                                )}`
                              );
                            }}
                          >
                            Discover More
                          </Button>
                          <Button
                            variant="primary"
                            style={{
                              marginLeft: "10px",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/song/${encodeURIComponent(
                                  item.value.artist_name
                                )}/${encodeURIComponent(item.value.song_name)}`
                              );
                            }}
                          >
                            Details
                          </Button>
                          <SongReportButton
                            setSubmitted={setSubmitted}
                            submitted={submitted}
                            songName={item.value.song_name}
                          />
                        </>
                      )}
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            ))}
          </Col>
        ))}
      </Row>

      <ButtonGroup>
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage <= 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default PaginatedColumns;
