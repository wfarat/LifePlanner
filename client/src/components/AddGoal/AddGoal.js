import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addGoal, selectGoals } from '../../features/Goals/goalsSlice';
import AddGoalTask from '../AddGoalTask/AddGoalTask';
import Container from 'react-bootstrap/esm/Container';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
export default function AddGoal() {
  const user = useSelector(selectUser);
  const goalsData = useSelector(selectGoals);
  const { goals } = goalsData;
  const intl = useIntl();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [tasksArray, setTasksArray] = useState([]);
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
  const handleAddTask = (task, times) => {
    if (task.id === 'null') {
      setMessage(intl.formatMessage({ id: 'message.task' }));
      return;
    }
    const index = tasksArray.findIndex((val) => val.id === task.id);
    if (index === -1) {
      const taskObj = { id: task.id, name: task.name, times };
      setTasksArray([...tasksArray, taskObj]);
    } else {
      setMessage(intl.formatMessage({ id: 'message.taskadded' }));
    }
  };
  const handleDeleteTask = (task) => {
    setTasksArray(tasksArray.filter((val) => val.id !== task));
  };
  return (
    <Container>
      <Form className="taskForm">
        <Form.Group className="mb-2" controlId="formBasicName">
          <Form.Label>
            <FormattedMessage id="goals.name" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            value={name}
            type="text"
            placeholder={intl.formatMessage({ id: 'goals.nameplaceholder' })}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formDescription">
          <Form.Label>
            <FormattedMessage id="form.description" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            as="textarea"
            rows={3}
            placeholder={intl.formatMessage({
              id: 'goals.descriptionplaceholder',
            })}
          />
        </Form.Group>
        <Form.Text className="text-danger">
          {message}
          {goalsData.message}
        </Form.Text>
      </Form>
      <AddGoalTask
        handleAddTask={handleAddTask}
        handleDeleteTask={handleDeleteTask}
        tasksArray={tasksArray}
      />
      <Button variant="success" className="mt-2" onClick={handleClick}>
        <FormattedMessage id="button.submit" />
      </Button>
    </Container>
  );
}
