import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const LineChart = ({ times, record, color, label }) => {
  const graphData = {
    labels: times,
    datasets: [
      {
        label,
        data: record,
        backgroundColor: ['transparent'],
        borderColor: [color],
        borderWidth: 2,
      },
    ],
  };

  return (
    <Line
      height={80}
      data={graphData}
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default LineChart;
