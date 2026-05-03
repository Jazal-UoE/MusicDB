// Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="mt-5 py-3 bg-dark text-white">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              MusicRecSys &copy; {new Date().getFullYear()}
            </p>
            <p>UG4 Project</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
