import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './addTask.css';
export default function AddTask() {
  const user = useSelector(selectUser);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState([]);
  const dispatch = useDispatch();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const handleChange = (e) => {
    const value = e.target.value + 1;
    const index = repeat.findIndex(val => val === value);
    if (index === -1) {
        setRepeat([...repeat, value]);
    } else {
        setRepeat(repeat.filter(val => val !== value));
    }
  }
  console.log(duration)
  const handleClick = async () => {
    
  };
  return (
    <Form className="taskForm">
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Task Name</Form.Label>
        <Form.Control
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          value={name}
          type="text"
          placeholder="Enter task name"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          as="textarea"
          rows={3}
          placeholder="Enter description"
        />
      </Form.Group>
      <Form.Label>Duration: {duration} minutes</Form.Label>
      <Form.Range value={duration} onChange={e => setDuration(e.target.value)} max="120"/>
      {days.map((day, index) => (
          <Form.Check
            inline
            label={day}
            value={index}
            onChange={handleChange}
            name={day}
            key={index}
            type="checkbox"
            id={`inline-checkbox-${index}`}
          />
      ))}
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
