// Import React to create a component, useEffect for lifecycle, and useRef for referencing DOM elements
import React, { useEffect, useRef } from "react";

// Import Chart.js (auto register all chart types and components)
import Chart from "chart.js/auto";

export default function TodayPieChart() {

    // A React ref that will point to the <canvas> element in the DOM
    const chartRef = useRef(null);

    // A ref to store the Chart.js instance so we can destroy it on re-render
    const chartInstance = useRef(null);

    // useEffect runs after the component is rendered in the DOM
    useEffect(() => {

        // If a chart already exists (from previous render), destroy it first to avoid duplication
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Get the 2D drawing context of the canvas
        const ctx = chartRef.current.getContext("2d");

        // Create a new Chart.js doughnut chart
        chartInstance.current = new Chart(ctx, {
            type: "doughnut",       // Chart type
            data: {
                labels: ['Cancel', 'Done', 'Undone'],
                datasets: [
                    {
                        label: "Subtask",      // Dataset name
                        data: [30, 50, 100],          // Values of each slice
                        backgroundColor: [            // Slice colors
                            "rgb(255, 99, 132)",      // Red
                            "rgb(54, 162, 235)",      // Blue
                            "rgb(255, 205, 86)"       // Yellow
                        ],
                        hoverOffset: 4,               // Pop-out distance on hover
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,          // Allow free resizing inside the parent div
            },
        });

        // Cleanup: When the component unmounts, destroy the chart to free memory
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };

    }, []); // Empty dependency → run only once on mount

    return (
        // The parent div controls the size of the chart visually
        <div
            style={{
                width: "190px",     // Width of the chart container
                height: "190px",    // Height of the chart container
                margin: "0 auto"    // Center horizontally
            }}
        >
            {/* The canvas where Chart.js will render the doughnut chart */}
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
