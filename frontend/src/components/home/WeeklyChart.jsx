import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./WeeklyChart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function WeeklyChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Start of the current week (Monday)
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));

  // ---------- Helpers ----------
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekLabels(startDate) {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    });
  }

  function getMockData() {
    return {
      done: [40, 50, 60, 70, 65, 55, 45],
      undone: [40, 30, 25, 20, 25, 30, 35],
      cancel: [20, 20, 15, 10, 10, 15, 20],
    };
  }

  // ---------- Chart ----------
  useEffect(() => {
    const labels = getWeekLabels(weekStart);
    const data = getMockData();

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Done",
            data: data.done,
            stack: "weekly",
          },
          {
            label: "Undone",
            data: data.undone,
            stack: "weekly",
          },
          {
            label: "Cancel",
            data: data.cancel,
            stack: "weekly",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (v) => `${v}%`,
            },
          },
        },
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [weekStart]);

  // ---------- Navigation ----------
  const goPrevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const goNextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  // ---------- UI ----------
  return (
    <div className="weekly-chart">
      <div className="weekly-chart__header">
        <button className="button" onClick={goPrevWeek}><FontAwesomeIcon icon={faArrowLeft} /></button>
        <strong >
          Week of {weekStart.toLocaleDateString("en-GB")}
        </strong>
        <button className="button" onClick={goNextWeek}><FontAwesomeIcon icon={faArrowRight} /></button>
      </div>

      <div className="weekly-chart__canvas">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}