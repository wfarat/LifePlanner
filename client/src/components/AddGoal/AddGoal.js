import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { addGoal, selectGoals } from '../../features/Goals/goalsSlice';
import { getTasks, selectTasks } from '../../features/tasks/tasksSlice';
export default function AddGoal() {
  const user = useSelector(selectUser);
  const { tasks } = useSelector(selectTasks);
  const goalsData = useSelector(selectGoals);
  const { goals } = goalsData;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [times, setTimes] = useState(0);
  const [task, setTask] = useState({});
  const [tasksArray, setTasksArray] = useState([]);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    if (tasks.length === 0) {
      const data = {
        userId: user.user.id,
        accessToken: user.accessToken,
      };
      dispatch(getTasks(data));
    }
  }, []);
  const handleClick = async () => {
    if (goals.findIndex((goal) => goal.name === name) === -1) {
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
            tasksArray,
          },
        };
        dispatch(addGoal(data));
      } else {
        setMessage('Please enter name.');
      }
    } else {
      setMessage('Goal with this name already exists.');
    }
  };
  const handleChange = (e) => {
    const newTask = e.target.value.split('|');
    setTask({ id: newTask[0], name: newTask[1] });
  };
  const handleAddTask = () => {
    if (task.id === 'null') {
      setMessage('Pick a task');
      return;
    }
    const index = tasksArray.findIndex((val) => val.id === task.id);
    if (index === -1) {
      const taskObj = { id: task.id, name: task.name, times };
      setTasksArray([...tasksArray, taskObj]);
    } else {
      setMessage('This tasks is already added.');
    }
  };
  const handleDeleteTask = (task) => {
    setTasksArray(tasksArray.filter((val) => val.id !== task));
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
      <Form.Select onChange={handleChange} aria-label="Select task">
        <option value={'null'}>Add Task (not required)</option>
        {tasks.map((task) => {
          return (
            <option value={`${task.id}|${task.name}`} key={task.id}>
              {task.name}
            </option>
          );
        })}
      </Form.Select>
      <Form.Label>Set Goal: {times} repeats</Form.Label>
      <Form.Range
        value={times}
        onChange={(e) => setTimes(e.target.value)}
        max="100"
      />
      <ListGroup>
        {tasksArray.length > 0 &&
          tasksArray.map((task) => {
            return (
              <ListGroup.Item
                action
                onClick={() => {
                  handleDeleteTask(task.id);
                }}
                key={task.id}
              >
                {task.name} {task.times > 0 && '/ Repeats:' + task.times}
              </ListGroup.Item>
            );
          })}
      </ListGroup>
      <Form.Text className="text-danger">
        {message}
        {goalsData.message}
      </Form.Text>
      <Button variant="secondary" onClick={handleAddTask}>
        Add Task
      </Button>
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
