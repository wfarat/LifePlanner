import React, { useEffect } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import './calendarPage.css';
import { dayClear } from '../../features/day/daySlice';
import { useDispatch } from 'react-redux';
export default function CalendarPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(dayClear());
  }, []);
  const onChange = (value) => {
    const day = value.getDate();
    const month = value.getMonth() + 1;
    const year = value.getFullYear();
    const dateString = `${day}${month}${year}`;
    return navigate(`../day/${dateString}`);
  };
  return (
    <div className="Sample">
      <Calendar className="center" onChange={onChange} />
    </div>
  );
}
