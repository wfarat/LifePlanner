import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addGoal, selectGoals } from '../../features/Goals/goalsSlice';
export default function AddGoal() {
  const user = useSelector(selectUser);
  const goalsData = useSelector(selectGoals);
  const {goals} = goalsData;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();  
  const handleClick = async () => {
    if (goals.findIndex(goal => goal.name === name) === -1) {
    if (name) { 
      if (!description) {
        setDescription('empty');
      }
      setMessage('');
    const data = {
        userId: user.user.id,
        accessToken: user.accessToken,
        goal: {
        name,
        description,
        duration: duration * 60,
        }
    }
    dispatch(addGoal(data));
} else {
setMessage('Please enter name.')
} } else {
setMessage('Goal with this name already exists.')    
}
  };
  return (
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
      <Form.Label>Duration: {duration} hours</Form.Label>
      <Form.Range value={duration} onChange={e => setDuration(e.target.value)} max="1000"/>
      <Form.Text className="text-danger">{message}{goalsData.message}</Form.Text>
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
