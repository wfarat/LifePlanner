import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addGoal, selectGoals } from '../../features/Goals/goalsSlice';
import AddGoalTask from '../AddGoalTask/AddGoalTask';
import Container from 'react-bootstrap/esm/Container';
import { useNavigate } from 'react-router-dom';
export default function AddGoal() {
  const user = useSelector(selectUser);
  const goalsData = useSelector(selectGoals);
  const { goals } = goalsData;
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tasksArray, setTasksArray] = useState([]);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const handleClick = async () => {
    if (goals.findIndex((goal) => goal.name === name) === -1) {
      if (name) {
        if (!description) {
          setDescription('empty');
        }
        setMessage('');
        const data = {
          accessToken: user.accessToken,
          goal: {
            name,
            description,
            tasksArray,
          },
        };
        dispatch(addGoal(data));
        navigate('../../goals');
      } else {
        setMessage('Please enter name.');
      }
    } else {
      setMessage('Goal with this name already exists.');
    }
  };
  return (
    <Container>
      <Form className="taskForm">
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Goal Name</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            value={name}
            type="text"
            placeholder="Enter goal name"
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
        <Form.Text className="text-danger">
          {message}
          {goalsData.message}
        </Form.Text>
      </Form>
      <AddGoalTask tasksArray={tasksArray} setTasksArray={setTasksArray} />
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    </Container>
  );
}
