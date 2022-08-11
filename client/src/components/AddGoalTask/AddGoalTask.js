import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { selectTasks } from '../../features/tasks/tasksSlice';
export default function AddGoalTask(props) {
  const { tasks } = useSelector(selectTasks);
  const [times, setTimes] = useState(1);
  const [task, setTask] = useState({});
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    const newTask = e.target.value.split('|');
    setTask({ id: newTask[0], name: newTask[1] });
  };
  const handleAddTask = () => {
    if (task.id === 'null') {
      setMessage('Pick a task');
      return;
    }
    const index = props.tasksArray.findIndex((val) => val.id === task.id);
    if (index === -1) {
      const taskObj = { id: task.id, name: task.name, times };
      props.setTasksArray([...props.tasksArray, taskObj]);
    } else {
      setMessage('This tasks is already added.');
    }
  };
  const handleDeleteTask = (task) => {
    props.setTasksArray(props.tasksArray.filter((val) => val.id !== task));
  };
  return (
    <Form className="taskForm">
      <Form.Label>Add Tasks: (Not Required)</Form.Label>
      <Form.Select onChange={handleChange} aria-label="Select task">
        <option value={'null'}>Select task</option>
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
        min="1"
      />
      <ListGroup>
        {props.tasksArray.length > 0 &&
          props.tasksArray.map((task) => {
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
      <Form.Text className="text-danger">{message}</Form.Text>
      <Button variant="secondary" onClick={handleAddTask}>
        Add Task
      </Button>
    </Form>
  );
}
