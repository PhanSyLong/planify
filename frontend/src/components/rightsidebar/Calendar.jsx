import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import "./Calendar.css";

export default function Calendar() {
  const months = [
    "January",
    "Ferbuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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

    // Previous month days
    for (let i = firstDay; i > 0; i--) {
      days.push({
        day: prevMonthLastDay - i + 1,
        type: "fade",
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay; i++) {
      let type = "";

      if (
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        type = "today";
      }

      days.push({ day: i, type });
    }

    // Next month days
    const remaining =
      7 - ((firstDay + lastDay) % 7 || 7);

    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        type: "fade",
      });
    }

    setCalendarDays(days);
  }

  function prevMonth() {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  }

  return (
    <div className="calendar">
      <div className="header">
        <div className="btn" onClick={prevMonth}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>

        <div id="month-year">
          {months[currentDate.getMonth()]}{" "}
          {currentDate.getFullYear()}
        </div>

        <div className="btn" onClick={nextMonth}>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>

      <div className="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="days">
        {calendarDays.map((d, index) => (
          <div
            key={index}
            className={d.type ? d.type : ""}
          >
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );
}
