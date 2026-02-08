import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./WeeklyChart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { getWeeklyPerformance } from "../../api/dailyPerformance";

export default function WeeklyChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Start of the current week (Monday)
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [isLoading, setIsLoading] = useState(false);

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

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  // ---------- Chart ----------
  useEffect(() => {
    const labels = getWeekLabels(weekStart);

    // Calculate start and end dates for the week
    const startDate = formatDate(weekStart);
    const endDate = new Date(weekStart);
    endDate.setDate(endDate.getDate() + 6);
    const endDateStr = formatDate(endDate);

    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await getWeeklyPerformance(startDate, endDateStr);
        const weeklyData = response.data || [];

        // Initialize arrays for each day
        const done = Array(7).fill(0);
        const incomplete = Array(7).fill(0);
        const cancel = Array(7).fill(0);

        // Map API data to chart format
        weeklyData.forEach(day => {
          if (!day.date) return;
          const dayDate = new Date(day.date);
          const dayIndex = Math.floor((dayDate - weekStart) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < 7) {
            done[dayIndex] = day.subtasksCompleted || 0;
            incomplete[dayIndex] = day.subtasksIncompleted || 0;
            cancel[dayIndex] = day.subtasksCancelled || 0;
          }
        });

        // Calculate percentages for each day
        const donePercent = [];
        const incompletePercent = [];
        const cancelPercent = [];

        for (let i = 0; i < 7; i++) {
          const total = done[i] + incomplete[i] + cancel[i];
          if (total === 0) {
            donePercent.push(0);
            incompletePercent.push(0);
            cancelPercent.push(0);
          } else {
            donePercent.push(Math.round((done[i] / total) * 100));
            incompletePercent.push(Math.round((incomplete[i] / total) * 100));
            cancelPercent.push(Math.round((cancel[i] / total) * 100));
          }
        }

        // Destroy existing chart
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
                data: donePercent,
                stack: "weekly",
                backgroundColor: "rgba(54, 162, 235, 0.75)",
                // Store raw counts for tooltip
                rawData: done,
              },
              {
                label: "Incomplete",
                data: incompletePercent,
                stack: "weekly",
                backgroundColor: "rgba(255, 205, 86, 0.75)",
                rawData: incomplete,
              },
              {
                label: "Cancel",
                data: cancelPercent,
                stack: "weekly",
                backgroundColor: "rgba(255, 99, 132, 0.75)",
                rawData: cancel,
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
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const dataset = context.dataset;
                    const rawValue = dataset.rawData?.[context.dataIndex] || 0;
                    const percentValue = context.parsed.y || 0;
                    return `${dataset.label}: ${rawValue} (${percentValue}%)`;
                  },
                },
              },
            },
          },
        });
      } catch (err) {
        console.error("Failed to load weekly performance", err);
        // Show empty chart on error
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels,
            datasets: [
              { label: "Done", data: Array(7).fill(0), stack: "weekly", backgroundColor: "rgb(54, 162, 235)" },
              { label: "Incomplete", data: Array(7).fill(0), stack: "weekly", backgroundColor: "rgb(255, 205, 86)" },
              { label: "Cancel", data: Array(7).fill(0), stack: "weekly", backgroundColor: "rgb(255, 99, 132)" },
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
                ticks: { callback: (v) => `${v}%` },
              },
            },
            plugins: { legend: { position: "bottom" } },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

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
        {isLoading && <div className="loading-overlay">Loading...</div>}
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
