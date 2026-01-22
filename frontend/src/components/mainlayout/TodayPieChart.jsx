import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./TodayPieChart.css";

export default function TodayPieChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    chartInstance.current?.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Cancel", "Done", "Undone"],
        datasets: [{
          data: [30, 50, 100],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
        }],
      },
      options: { maintainAspectRatio: false },
    });

    return () => chartInstance.current?.destroy();
  }, []);

  return (
    <div className="today-pie">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
