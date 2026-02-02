import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./TodayPieChart.css";
import { getTodayDailyPerformance } from "../../api/dailyPerformance.js";

export default function TodayPieChart() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getTodayDailyPerformance();

                const {
                    subtasksCompleted,
                    subtasksIncompleted,
                    subtasksCancelled,
                } = res.data;

                // destroy chart cũ
                chartInstance.current?.destroy();

                chartInstance.current = new Chart(chartRef.current, {
                    type: "doughnut",
                    data: {
                        labels: ["Cancel", "Done", "Incomplete"],
                        datasets: [
                            {
                                data: [
                                    subtasksCancelled,
                                    subtasksCompleted,
                                    subtasksIncompleted,
                                ],
                                backgroundColor: [
                                    "rgb(255, 99, 132)",
                                    "rgb(54, 162, 235)",
                                    "rgb(255, 205, 86)",
                                ],
                            },
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: "bottom" },
                        },
                    },
                });
            } catch (err) {
                console.error("Load daily performance failed", err);
            }
        };

        loadData();

        return () => chartInstance.current?.destroy();
    }, []);

    return (
        <div className="today-pie">
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
