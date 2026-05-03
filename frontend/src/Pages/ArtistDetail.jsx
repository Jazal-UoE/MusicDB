import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import {
  Tooltip,
  OverlayTrigger,
  Row,
  Col,
  Table,
  Pagination,
  FormControl,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import config from "../config";
import ConnectionsGraph from "../Components/Graph"; // Ensure this path is correct

const ContextMenu = ({ x, y, onReportIssue }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "white",
        boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
        zIndex: 1000,
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <Button variant="light" onClick={onReportIssue}>
        Report Issue
      </Button>
    </div>
  );
};

function ArtistDetail() {
  const { artistName } = useParams();
  const navigate = useNavigate();

  // Data States
  const [songDetails, setSongDetails] = useState({});
  const [albumDetails, setAlbumDetails] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageAlbum, setCurrentPageAlbum] = useState(1);
  const [currentPageContributions, setCurrentPageContributions] = useState(1);
  const [currentPageCollaborative, setCurrentPageCollaborative] = useState(1);

  // Search States
  const [searchSong, setSearchSong] = useState("");
  const [searchContributions, setSearchContributions] = useState("");
  const [searchAlbum, setSearchAlbum] = useState("");
  const [searchCollaborative, setSearchCollaborative] = useState("");

  const itemsPerPage = 10;

  // Context Menu & Reporting States
  const [contextMenu, setContextMenu] = useState(null);
  const [reportSongName, setReportSongName] = useState(null);
  const [reportIssue, setReportIssue] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    // 1. Fetch Songs Details 
    fetch(`${config.API_BASE_URL}/api/artists/details/?artist_name=${encodeURIComponent(artistName)}`)
      .then((response) => response.ok ? response.json() : {})
      .then((data) => setSongDetails(data))
      .catch((error) => console.error("Error fetching song details:", error));

    // 2. Fetch Albums 
    fetch(`${config.API_BASE_URL}/api/albums3/by_artist/?artist_name=${encodeURIComponent(artistName)}`)
      .then((response) => response.ok ? response.json() : { artist_albums: [] })
      .then((data) => setAlbumDetails(data.artist_albums || []))
      .catch((error) => console.error("Error fetching album information:", error));

    // 3. Fetch Collaborative Connections and map to local state
    fetch(`${config.API_BASE_URL}/api/artist/contributors/?artist_name=${encodeURIComponent(artistName)}`)
      .then((response) => response.ok ? response.json() : {})
      .then((data) => {
        const connectionsMap = {};
        const categories = [
          { key: 'composer_connections', prop: 'composer' },
          { key: 'lyricist_connections', prop: 'lyricist' },
          { key: 'tuning_connections', prop: 'tuner' },
          { key: 'artist_connections', prop: 'singer' }
        ];

        categories.forEach(({ key, prop }) => {
          if (data[key]) {
            Object.entries(data[key]).forEach(([name, count]) => {
              if (!connectionsMap[name]) {
                connectionsMap[name] = { name, composer: 0, lyricist: 0, tuner: 0, singer: 0, total: 0 };
              }
              connectionsMap[name][prop] = count;
              connectionsMap[name].total += count;
            });
          }
        });

        const sortedConnections = Object.values(connectionsMap).sort((a, b) => b.total - a.total);
        setCollaborators(sortedConnections);
      })
      .catch((error) => console.error("Error fetching collaborative connections:", error));
  }, [artistName]);

  const handleRowClick = (path) => navigate(path);

  const handleContextMenu = (event, songName) => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY, songName: songName });
  };

  const handleReportIssueClick = () => {
    setReportSongName(contextMenu.songName);
    setContextMenu(null);
  };

  const handleReportSubmit = () => {
    fetch(`${config.API_BASE_URL}/api/songs4/report/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_name: reportSongName, issue: reportIssue }),
    })
      .then((response) => response.json())
      .then(() => {
        setShowSuccessAlert(true);
        setReportIssue("");
        setReportSongName(null);
      })
      .catch((error) => console.error("Error submitting report:", error));
  };

  const renderPagination = (items, currentPage, setCurrentPage) => {
    const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
    return (
      <Pagination className="justify-content-center my-4">
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        <Pagination.Item disabled>/ {totalPages}</Pagination.Item>
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages} />
      </Pagination>
    );
  };

  const filterItems = (items, searchTerm) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderSongDetailsSection = () => {
    if (!songDetails?.artist_songs?.length) return null;
    const filteredItems = filterItems(songDetails.artist_songs, searchSong);
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <Col md={12} className="mt-3 mb-3">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <OverlayTrigger placement="top" overlay={<Tooltip>Artist Discography: Singer Roles</Tooltip>}>
            <h3 style={{ cursor: "default" }}>Artist's Discography</h3>
          </OverlayTrigger>
          <FormControl type="text" placeholder="Search Songs" value={searchSong} onChange={(e) => setSearchSong(e.target.value)} style={{ width: "200px" }} />
        </div>
        <Table hover bordered>
          <thead className="thead-dark">
            <tr>
              <th>Song Name</th><th>Composers</th><th>Lyricists</th><th>Tuners</th><th>Artists</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((song, index) => (
              <React.Fragment key={index}>
                <tr onContextMenu={(e) => handleContextMenu(e, song.song_name)}>
                  <td onClick={() => handleRowClick(`/song/${artistName}/${song.song_name}`)} style={{ cursor: "pointer" }}>{song.song_name}</td>
                  <td onClick={() => handleRowClick(`/artist/${song.composer_name}`)} style={{ cursor: "pointer" }}>{song.composer_name}</td>
                  <td onClick={() => handleRowClick(`/artist/${song.lyricist_name}`)} style={{ cursor: "pointer" }}>{song.lyricist_name}</td>
                  <td onClick={() => handleRowClick(`/artist/${song.tuning_name}`)} style={{ cursor: "pointer" }}>{song.tuning_name}</td>
                  <td onClick={() => handleRowClick(`/artist/${song.artist_name}`)} style={{ cursor: "pointer" }}>{song.artist_name}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
        {renderPagination(filteredItems, currentPage, setCurrentPage)}
      </Col>
    );
  };

  const renderCollaborativeConnectionsSection = () => {
    if (!collaborators || collaborators.length === 0) return null;
    const filteredItems = filterItems(collaborators, searchCollaborative);
    const currentItems = filteredItems.slice((currentPageCollaborative - 1) * itemsPerPage, currentPageCollaborative * itemsPerPage);
    
    // Transform data for the ConnectionsGraph [name, totalValue]
    const graphData = collaborators.map(c => [c.name, c.total]);

    // Function to handle the trophy display logic
    const getRankDisplay = (index) => {
      const rank = index + 1 + (currentPageCollaborative - 1) * itemsPerPage;
      if (rank === 1) return "🥇 1";
      if (rank === 2) return "🥈 2";
      if (rank === 3) return "🥉 3";
      return rank;
    };

    return (
      <Col md={12} className="mt-3 mb-3">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ cursor: "default" }}>Collaborative Connections</h3>
          <FormControl type="text" placeholder="Search Connections" value={searchCollaborative} onChange={(e) => setSearchCollaborative(e.target.value)} style={{ width: "200px" }} />
        </div>

        {/* --- GRAPH INTEGRATION --- */}
        <Row className="mb-4 justify-content-center">
            <ConnectionsGraph view={artistName} data={graphData} colorNode="#00d1b2" />
        </Row>

        <Table hover bordered>
          <thead className="thead-dark">
            <tr>
              <th>Rank</th><th>Name</th><th>Composer</th><th>Lyricist</th><th>Tuner</th><th>Singer</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((connection, index) => (
              <tr key={index} onClick={() => handleRowClick(`/artist/${connection.name}`)} style={{ cursor: "pointer" }}>
                <td>{getRankDisplay(index)}</td>
                <td>{connection.name}</td>
                <td>{connection.composer}</td>
                <td>{connection.lyricist}</td>
                <td>{connection.tuner}</td>
                <td>{connection.singer}</td>
                <td>{connection.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {renderPagination(filteredItems, currentPageCollaborative, setCurrentPageCollaborative)}
      </Col>
    );
  };

  const capitalizeWords = (str) =>
    str ? str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") : "";

  return (
    <Container style={{ color: "#F5F5F5" }}>
      <Row className="mt-4 mb-3">
        <h1>{capitalizeWords(artistName)}'s Data Insights</h1>
      </Row>
      <Row>
        {renderSongDetailsSection()}
        {renderCollaborativeConnectionsSection()}
      </Row>
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} onReportIssue={handleReportIssueClick} />}
    </Container>
  );
}

export default ArtistDetail;
