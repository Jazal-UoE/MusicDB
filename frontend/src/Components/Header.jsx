import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, ListGroup, Form } from "react-bootstrap";
import "material-icons/iconfont/material-icons.css";
import config from "../config";

function NavScrollExample() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2 && isTyping) {
        try {
          const response = await fetch(
            `${
              config.API_BASE_URL
            }/api/songs2/search/?query=${encodeURIComponent(searchQuery)}`
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
  }, [searchQuery, isTyping]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);
  };

  const selectSuggestion = (suggestion) => {
    setSearchQuery("");
    setIsTyping(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/home">
          <span
            style={{ position: "relative", top: "2px" }}
            class="material-icons"
          >
            headphones
          </span>{" "}
          MusicRec
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={NavLink} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/artists">
              Artists
            </Nav.Link>
            {/* <Nav.Link as={NavLink} to="/songs">
              Songs
            </Nav.Link>
            <Nav.Link as={NavLink} to="/albums">
              Albums
            </Nav.Link> */}
            <Nav.Link as={NavLink} to="/top-n">
              Top-N Recommender
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
