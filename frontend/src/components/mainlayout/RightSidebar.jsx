import Calendar from "./Calendar";
import TodayPieChart from "./TodayPieChart";
import "./RightSidebar.css";

export default function RightSidebar() {
  return (
    <aside className="right-sidebar">
      <section className="calendar-wrapper">
        <Calendar />
      </section>

      <section className="performance">
        <div className="performance-title">
          Today's Performance
        </div>
        <TodayPieChart />
      </section>
    </aside>
  );
}
