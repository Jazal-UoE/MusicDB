import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Pagination, Form } from "react-bootstrap";
import SearchExample from "../Components/search";
import { useNavigate } from "react-router-dom";
import config from "../config";

function Artists() {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [country, setCountry] = useState("Iran");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getQueryParams = (params, url) => {
    let href = url;
    // this expression is to get the query strings
    let reg = new RegExp("[?&]" + params + "=([^&#]*)", "i");
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };

  useEffect(() => {
    const countryQuery = getQueryParams("country", window.location.href);
    const urlCountry = countryQuery ? decodeURIComponent(countryQuery) : "Iran";
    setCountry(urlCountry);
  }, []);

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      const url = `${config.API_BASE_URL}/api/artists/filter/?country=${country}&page=${currentPage}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        console.log("Full API Data Object:", data); // Log 2: This is the most important one
        console.log("Data Results:", data.results);
        setArtists(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
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

const handleRowClick = async (artistName) => {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/api/artist/contributors/?artist_name=${encodeURIComponent(artistName)}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Check the keys that your Django API actually returns
    const hasData = 
      (data.composer_connections && Object.keys(data.composer_connections).length > 0) ||
      (data.lyricist_connections && Object.keys(data.lyricist_connections).length > 0) ||
      (data.tuning_connections && Object.keys(data.tuning_connections).length > 0) ||
      (data.artist_connections && Object.keys(data.artist_connections).length > 0);

    if (hasData) {
      // If we found data, navigate to the detail page
      navigate(`/artist/${encodeURIComponent(artistName)}`);
    } else {
      console.log("No relevant data available for this artist.");
      alert("No data available for this artist.");
    }
  } catch (error) {
    console.error("Failed to fetch artist details:", error);
  }
};
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleRowClick(searchQuery);
  };

  const capitalizeArtistName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <Container>
      <Row className="justify-content-md-center mb-3 mt-4">
        <Col>
          <h1 style={{ color: "white" }} className="text-center mt-4 sm-4">
            Artists Dataset
          </h1>
        </Col>
        <Col md={8} className="mb-5 mt-4 sm-8">
          <Form onSubmit={handleSearchSubmit}>
            <SearchExample
              onSelectSuggestion={handleRowClick}
              placeholder="Search artists..."
              dataQuery={"artists"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
        </Col>
      </Row>

      <Row className="my-3">
        <Col>
          <Form.Select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="Iran">Iran</option>
            <option value="India">India</option>
            <option value="Turkey">Turkey</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            striped
            bordered
            hover
            variant="light"
            className="bg-white text-dark"
          >
            <thead>
              <tr>
                <th>Artist Name</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(artist.artist_name)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{capitalizeArtistName(artist.artist_name)}</td>
                  <td>{artist.country}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Pagination className="justify-content-center my-4">
        <Pagination.Prev onClick={handlePrevious} disabled={!previousPageUrl} />
        <Pagination.Item>{currentPage}</Pagination.Item>
        <Pagination.Next onClick={handleNext} disabled={!nextPageUrl} />
      </Pagination>
    </Container>
  );
}

export default Artists;
