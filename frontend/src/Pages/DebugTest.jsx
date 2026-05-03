import React, { useEffect } from "react";

const DebugTest = () => {
  const artistName = "Shadmehr Aqili"; // Change this variable to the artist name you want to query

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/artists4/collaboratorConnection/?artist_name=${encodeURIComponent(
            artistName
          )}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Artist Data:", data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };

    const fetchInverseConnections = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/artists5/inverseConnections/?artist_name=${encodeURIComponent(
            artistName
          )}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Inverse Connections Data:", data);
      } catch (error) {
        console.error("Error fetching inverse connections data:", error);
      }
    };

    fetchArtistData();
    fetchInverseConnections();
  }, [artistName]);

  return <div>Fetching artist data for {artistName}...</div>;
};

export default DebugTest;
