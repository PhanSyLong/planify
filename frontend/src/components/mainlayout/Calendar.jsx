import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import "./Calendar.css";

export default function Calendar() {
  const months = [
    "January","Ferbuary","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const today = new Date();

  useEffect(() => {
    renderCalendar(currentDate);
  }, [currentDate]);

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDay; i > 0; i--) {
      days.push({ day: prevMonthLastDay - i + 1, type: "fade" });
    }

    for (let i = 1; i <= lastDay; i++) {
      let type = "";
      if (
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) type = "today";

      days.push({ day: i, type });
    }

    const remaining = 7 - ((firstDay + lastDay) % 7 || 7);
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, type: "fade" });
    }

    setCalendarDays(days);
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="btn" onClick={() =>
          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        }>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>

        <div className="month-year">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>

        <div className="btn" onClick={() =>
          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        }>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>

      <div className="weekdays">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="days">
        {calendarDays.map((d, i) => (
          <div key={i} className={d.type}>{d.day}</div>
        ))}
      </div>
    </div>
  );
}
