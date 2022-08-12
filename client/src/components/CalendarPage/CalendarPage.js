import React from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import './calendarPage.css';

export default function CalendarPage() {
  const navigate = useNavigate();
  const onChange = (value) => {
    let day = value.getDate();
    if (day < 10) { 
      day = '0' + day;
    }
    let month = value.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    const year = value.getFullYear();
    const dateString = `${year}${month}${day}`;
    return navigate(`../day/${dateString}`);
  };
  return (
    <div className="Sample">
      <Calendar className="center" onChange={onChange} />
    </div>
  );
}
