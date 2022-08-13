import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { selectTasks } from '../../features/tasks/tasksSlice';
import { FormattedMessage, useIntl } from 'react-intl';
export default function AddGoalTask(props) {
  const { tasks } = useSelector(selectTasks);
  const [times, setTimes] = useState(1);
  const intl = useIntl();
  const [task, setTask] = useState({});
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    const newTask = e.target.value.split('|');
    setTask({ id: newTask[0], name: newTask[1] });
  };
  const handleAddTask = () => {
    if (task.id === 'null') {
      setMessage(intl.formatMessage({id: "message.task"}));
      return;
    }
    const index = props.tasksArray.findIndex((val) => val.id === task.id);
    if (index === -1) {
      const taskObj = { id: task.id, name: task.name, times };
      props.setTasksArray([...props.tasksArray, taskObj]);
    } else {
      setMessage(intl.formatMessage({id: "message.taskadded"}));
    }
  };
  const handleDeleteTask = (task) => {
    props.setTasksArray(props.tasksArray.filter((val) => val.id !== task));
  };
  return (
    <Form className="taskForm mt-2">
      <Form.Label><FormattedMessage id="goals.tasks" /></Form.Label>
      <Form.Select onChange={handleChange} aria-label="Select task">
        <option value={'null'}><FormattedMessage id="tasks.select" /></option>
        {tasks.map((task) => {
          return (
            <option value={`${task.id}|${task.name}`} key={task.id}>
              {task.name}
            </option>
          );
        })}
      </Form.Select>
      <Form.Label><FormattedMessage id="goals.times" values={{times}} /></Form.Label>
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
      <Button variant="warning" onClick={handleAddTask}>
        <FormattedMessage id="button.addtask" />
      </Button>
    </Form>
  );
}
