import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { selectTasks } from '../../features/tasks/tasksSlice';
import { FormattedMessage, useIntl } from 'react-intl';
export default function AddGoalTask(props) {
  const { tasks } = useSelector(selectTasks);
  const [times, setTimes] = useState(1);
  const intl = useIntl();
  const [task, setTask] = useState({ id: 'null' });
  const handleChange = (e) => {
    const newTask = e.target.value.split('|');
    setTask({ id: newTask[0], name: newTask[1] });
  };
  return (
    <Form className="taskForm mt-2">
      <Form.Label>
        <FormattedMessage id="goals.tasks" />
      </Form.Label>
      <Form.Select onChange={handleChange} aria-label="Select task">
        <option value="null">
          <FormattedMessage id="tasks.select" />
        </option>
        {tasks.map((task) => {
          return (
            <option value={`${task.id}|${task.name}`} key={task.id}>
              {task.name}
            </option>
          );
        })}
      </Form.Select>
      <Form.Group as={Row}>
        <Form.Label column xs="8">
          <FormattedMessage id="goals.times"/>
        </Form.Label>
        <Col xs="4">
          <Form.Control
            onChange={(e) => setTimes(e.target.value)}
            value={times}
            type="number"
            min="1"
          />
        </Col>
      </Form.Group>

      <ListGroup>
        {props.tasksArray.length > 0 &&
          props.tasksArray.map((task) => {
            return (
              <ListGroup.Item
                action
                onClick={() => {
                  props.handleDeleteTask(task.id);
                }}
                key={task.id}
              >
                {task.name}{' '}
                {task.times > 0 &&
                  intl.formatMessage({ id: 'goaltask.repeats' }) + task.times}
              </ListGroup.Item>
            );
          })}
      </ListGroup>

      <Button
        variant="warning"
        onClick={() => {
          props.handleAddTask(task, times);
        }}
      >
        <FormattedMessage id="button.addtask" />
      </Button>
    </Form>
  );
}
