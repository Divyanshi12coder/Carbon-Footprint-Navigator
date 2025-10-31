import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

export default function Dashboard() {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    axios.get('/api/emissions').then(res => {
      setDataPoints(res.data.map(d => d.value));
    });
  }, []);

  const chartData = {
    labels: dataPoints.map((_, i) => `Day ${i + 1}`),
    datasets: [{
      label: 'Carbon Emissions (kg CO₂)',
      data: dataPoints,
      borderColor: '#22c55e',
      backgroundColor: '#bbf7d0',
      fill: true
    }]
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Carbon Emissions Over Time</h2>
      <Line data={chartData} />
    </div>
  );
}