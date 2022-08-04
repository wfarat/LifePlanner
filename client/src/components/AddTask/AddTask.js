import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './addTask.css';
import { selectGoals } from '../../features/Goals/goalsSlice';
import { addTask, selectTasks } from '../../features/tasks/tasksSlice';
export default function AddTask() {
  const user = useSelector(selectUser);
  const { goals } = useSelector(selectGoals);
  const tasksData = useSelector(selectTasks);
  const { tasks } = tasksData;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [goal, setGoal] = useState(null);
  const [message, setMessage] = useState('');
  const [repeat, setRepeat] = useState([]);
  const dispatch = useDispatch();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const handleChange = (e) => {
    const value = e.target.value;
    const index = repeat.findIndex(val => val === value);
    if (index === -1) {
        setRepeat([...repeat, value]);
    } else {
        setRepeat(repeat.filter(val => val !== value));
    }
  }
  const handleGoal = (e) => {
    setGoal(e.target.value);
  }
  const handleClick = async () => {
    if (tasks.findIndex(goal => goal.name === name) === -1) {
      if (name) { 
        if (!description) {
          setDescription('empty');
        }
        setMessage('');
      const data = {
          userId: user.user.id,
          accessToken: user.accessToken,
          task: {
          name,
          description,
          duration,
          repeat,
          goalId: goal
          }
      }
      dispatch(addTask(data));
  } else {
  setMessage('Please enter name.')
  } } else {
  setMessage('Task with this name already exists.')    
  }
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
          <Form.Select onChange={handleGoal} aria-label="Default select example">
      <option value={null}>Select Goal (not required)</option>
      {goals.map(goal => {
        return <option value={goal.id} key={goal.id}>{goal.name}</option>
      })}
    </Form.Select>
    <Form.Text className="text-danger">{message}{tasksData.message}</Form.Text>
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
