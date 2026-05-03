import React from "react";
import { Container } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const BarChartComponent = ({ data }) => {
  const chartData = data.map(([name, value]) => ({ name, value }));
  const navigate = useNavigate();
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "5px",
            border: "1px solid #ccc",
          }}
        >
          <p style={{ color: "black" }}>{`${data.name}: ${data.value}`}</p>
        </div>
      );
    }

    return null;
  };

  const handleBarClick = (data) => {
    navigate(`/artist/${encodeURIComponent(data.name)}`);
  };

  return (
    <Container className="mt-5">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" tick={false} />{" "}
        {/* Only hide tick labels on X-axis */}
        <YAxis /> {/* Y-axis labels will be shown */}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="value"
          fill="#8884d8"
          onClick={(data) => handleBarClick(data)}
        />
      </BarChart>
    </Container>
  );
};

export default BarChartComponent;
