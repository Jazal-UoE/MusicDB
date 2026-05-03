import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import config from "../config";

function SongReportButton({ songName, submitted, setSubmitted }) {
  const [show, setShow] = useState(false);
  const [issue, setIssue] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSubmitted(false);
  };
  const handleShow = (event) => {
    event.stopPropagation();
    setSubmitted(true);
    setShow(true);
  };

  const handleSubmit = () => {
    setSubmitted(false);
    console.log(songName);
    console.log(issue);
    fetch("${config.API_BASE_URL}/api/songs4/report/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        song_name: songName,
        issue: issue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setShowSuccessAlert(true);

        handleClose();
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <>
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
        >
          The issue has been successfully reported. Thank you!
        </Alert>
      )}

      <Button variant="warning" onClick={(e) => handleShow(e)}>
        Report Issue
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report an Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Issue</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Report
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SongReportButton;
