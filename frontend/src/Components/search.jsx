import React, { useState, useEffect } from "react";
import { Form, ListGroup } from "react-bootstrap";
import config from "../config";

function SearchExample({
  dataQuery,
  onSelectSuggestion,
  placeholder = "Search...",
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(
            `${
              config.API_BASE_URL
            }/api/${dataQuery}/search/?q=${encodeURIComponent(query)}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();

          const uniqueSuggestions = [...new Set(data)];
          setSuggestions(uniqueSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    };

    const timerId = setTimeout(() => fetchSuggestions(), 500);
    return () => clearTimeout(timerId);
  }, [query, dataQuery]);

  return (
    <div>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        onFocus={() => query.length > 2 && setShowSuggestions(true)}
      />
      {showSuggestions && (
        <ListGroup
          className="position-absolute"
          style={{ zIndex: 1, width: "inherit" }}
        >
          {suggestions.map((suggestion, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => {
                onSelectSuggestion(suggestion);
                setShowSuggestions(false);
                setQuery("");
              }}
            >
              {suggestion}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default SearchExample;
