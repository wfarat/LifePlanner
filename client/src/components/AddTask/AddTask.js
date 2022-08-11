import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './addTask.css';
import { selectGoals } from '../../features/Goals/goalsSlice';
import { addTask, selectTasks } from '../../features/tasks/tasksSlice';
import { useParams, useNavigate } from 'react-router-dom';
export default function AddTask() {
  const user = useSelector(selectUser);
  const params = useParams();
  const { goals } = useSelector(selectGoals);
  const tasksData = useSelector(selectTasks);
  const { tasks } = tasksData;
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [times, setTimes] = useState(1);
  const [message, setMessage] = useState('');
  const linkGoal = goals.find((goal) => goal.id === Number(params.goalId));
  const [goal, setGoal] = useState(null);
  const [repeat, setRepeat] = useState([]);
  const dispatch = useDispatch();
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  useEffect(() => {
    if (linkGoal) {
      setGoal(linkGoal.id);
    }
  }, [linkGoal]);
  const handleChange = (e) => {
    const value = e.target.value;
    const index = repeat.findIndex((val) => val === value);
    if (index === -1) {
      setRepeat([...repeat, value]);
    } else {
      setRepeat(repeat.filter((val) => val !== value));
    }
  };
  const handleGoal = (e) => {
    if (e.target.value === 'null') {
      setGoal(null);
    } else {
      setGoal(e.target.value);
    }
  };
  const handleClick = async () => {
    if (tasks.findIndex((task) => task.name === name) === -1) {
      if (name) {
        if (!description) {
          setDescription('empty');
        }
        setMessage('');
        const data = {
          accessToken: user.accessToken,
          task: {
            name,
            description,
            duration,
            repeat,
            goal,
            times,
          },
        };
        dispatch(addTask(data));
        if (linkGoal) {
          navigate(`../../goals/${linkGoal.id}`);
        } else {
          navigate('../tasks/');
        }
      } else {
        setMessage('Please enter name.');
      }
    } else {
      setMessage('Task with this name already exists.');
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
      <Form.Group className="mb-3" controlId="formDuration">
      <Form.Label>Duration: {duration} minutes</Form.Label>
      <Form.Range
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        max="120"
      />
      </Form.Group>
      <Form.Group className="mb-3" controlId="fromRepeat">
      <Form.Label>Days to repeat:</Form.Label>
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
      </Form.Group>
      <Form.Select onChange={handleGoal} aria-label="Select goal">
        {!linkGoal && <option value="null">Select Goal (not required)</option>}
        {linkGoal && <option value={linkGoal.id}>{linkGoal.name}</option>}
        {goals.map((goal) => {
          return (
            <option value={goal.id} key={goal.id}>
              {goal.name}
            </option>
          );
        })}
      </Form.Select>
      <Form.Label>Set Goal: {times} times</Form.Label>
      <Form.Range
        value={times}
        onChange={(e) => setTimes(e.target.value)}
        min="1"
        max="100"
      />
      <Form.Text className="text-danger">
        {message}
        {tasksData.message}
      </Form.Text>
      <Button variant="success" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
