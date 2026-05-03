import React, { useEffect, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import { useNavigate } from "react-router-dom";

function ConnectionsGraph({ view, data, colorNode }) {
  const navigate = useNavigate();
  const fgRef = useRef();

  useEffect(() => {
    if (fgRef.current) {
      const fgInstance = fgRef.current;
      fgInstance.zoom(1.5, 500);
      fgInstance.centerAt(0, 0, 1000);
    }
  }, []);

  const nodes = [
    { id: view, color: "red", value: null },
    ...data.map((item) => ({
      id: item[0],
      color: colorNode,
      value: item[1],
    })),
  ];

  const links = data.map((item) => ({
    source: view,
    target: item[0],
    value: item[1],
    color: "blue",
  }));

  const handleNodeClick = (node) => {
    if (node.id !== view) {
      navigate(`/artist/${encodeURIComponent(node.id)}`);
    }
  };
  return (
    <div
      className="mt-3"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "500px",
        maxHeight: "300px",
        backgroundColor: "#333",
        transform: "scale()",
        transformOrigin: "top left",
      }}
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        nodeAutoColorBy="group"
        backgroundColor="#333333"
        width={500}
        height={300}
        linkColor={() => "blue"}
        onNodeClick={handleNodeClick}
        nodeLabel={(node) =>
          `${node.id}${node.value ? `: ${node.value} connections` : ""}`
        }
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
      />
    </div>
  );
}
export default ConnectionsGraph;
