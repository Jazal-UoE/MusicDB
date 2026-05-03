import React from "react";

import { Carousel, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import config from "../config";

function IranCard({ country, image }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_artists: "Loading...",
    total_songs: "Loading...",
    total_albums: "Loading...",
  });

  const handleDiscoverMore = () => {
    navigate(`/artists?country=${encodeURIComponent(country)}`);
  };
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/stats/country/?country=${country}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={image}
        style={{
          maxWidth: "286px",
          maxHeight: "163px",
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
      <Card.Body>
        <Card.Title>{country}</Card.Title>
        <Card.Text>
          <br />
          Total Artists: {stats.total_artists}
          <br />
          Total Songs: {stats.total_songs}
          <br />
          Total Albums: {stats.total_albums}
        </Card.Text>
        <Button variant="primary" onClick={handleDiscoverMore}>
          Discover More
        </Button>
      </Card.Body>
    </Card>
  );
}

function Home() {
  const countries = [
    {
      name: "Iran",
      image: "https://flagpedia.net/data/flags/w580/ir.webp",
      stats: "Placeholder for Iran's music stats.",
    },
    {
      name: "India",
      image: "https://flagpedia.net/data/flags/w580/in.webp",
      stats: "Placeholder for India's music stats.",
    },
    {
      name: "Turkey",
      image: "https://flagpedia.net/data/flags/w580/tr.webp",
      stats: "Placeholder for Turkey's music stats.",
    },
  ];

  return (
    <Container className="mt-5">
      {/* About the Project Section */}
      <Row className="justify-content-md-center mb-3">
        <Col md={8}>
          <Card className="text-center shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title as="h1">About the Project</Card.Title>
              <Card.Text>
                <p>
                  My project tackles the lack of accessible data on Middle
                  Eastern music, particularly in the realms of composers and
                  lyricists. I've developed a system that scrapes Wikipedia for
                  musical data, focusing on this underrepresented region. The
                  goal is to fill a significant gap in the digital music data
                  available, especially regarding the people behind the music -
                  the composers and lyricists.
                </p>
                <p>
                  After collecting this data, I use natural language processing
                  (NLP) techniques to clean and structure it, ensuring it's
                  useful for analysis and application. This cleaned data is then
                  encoded using one-hot encoding, a method that transforms
                  categorical data into a format that can be provided to machine
                  learning algorithms, enabling content-based recommendations.
                </p>
                <p>
                  Through this process, the system can offer music
                  recommendations by taking into account the artists behind the
                  songs. This adds a new dimension to music discovery, allowing
                  users to explore music through the lens of composition and
                  lyrics, potentially discovering new favorites they would have
                  otherwise never heard of.
                </p>
                <p>
                  My Project Currently supports three Country Datasets: Iran,
                  India, and Turkey
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mb-5">
        {/* Consistent column sizing and margin */}
        <Col md={3} className="mx-2">
          <IranCard
            country="Iran"
            image="https://flagpedia.net/data/flags/w580/ir.webp"
          />
        </Col>
        <Col md={3} className="mx-2">
          <IranCard
            country="India"
            image="https://flagpedia.net/data/flags/w580/in.webp"
          />
        </Col>
        <Col md={3} className="mx-2">
          <IranCard
            country="Turkey"
            image="https://flagpedia.net/data/flags/w580/tr.webp"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
