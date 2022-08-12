import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { selectTasks, selectTasksStatus } from '../../features/tasks/tasksSlice';
import {
  addDayTask,
  deleteDayTask,
  getDayTasks,
  selectDayTasks,
  updateDayTask,
} from './dayTasksSlice';
import { selectDay } from '../day/daySlice';

export default function DayTasks() {
  const user = useSelector(selectUser);
  const tasksStatus = useSelector(selectTasksStatus);
  const { day } = useSelector(selectDay);
  const dayTasksData = useSelector(selectDayTasks);
  const { dayTasks } = dayTasksData;
  const { tasks } = useSelector(selectTasks);
  const [time, setTime] = useState([]);
  const [task, setTask] = useState(0);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [show, setShow] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    const data = {
      dayRef: day.day_ref,
      accessToken: user.accessToken,
    };
    dispatch(getDayTasks(data));
  }, [day.day_ref]);
  const handleChange = (e) => {
    setTask(e.target.value);
  };
  const handleAddTask = () => {
    if (task === 0) {
      setMessage('Pick a task');
      return;
    }
    if (time.length === 0) {
      const data = {
        accessToken: user.accessToken,
        dayRef: day.day_ref,
        dayTask: { taskId: task },
      };
      dispatch(addDayTask(data));
    } else {
      const start = time[0].split(':');
      const startHours = Number(start[0]) * 60;
      const startMinutes = Number(start[1]);
      const finish = time[1].split(':');
      const finishHours = Number(finish[0] * 60);
      const finishMinutes = Number(finish[1]);
      const startTotal = startHours + startMinutes;
      const finishTotal = finishHours + finishMinutes;
      if (finishTotal < startTotal) {
        setMessage('Task finish time must be set after the start time.');
        return;
      }
      const data = {
        accessToken: user.accessToken,
        dayRef: day.day_ref,
        dayTask: {
          taskId: task,
          start: startTotal,
          finish: finishTotal,
        },
      };
      dispatch(addDayTask(data));
      setTime([]);
    }
  };
  const handleDeleteTask = (dayTaskId) => {
    const data = {
      accessToken: user.accessToken,
      dayTaskId,
    };
    dispatch(deleteDayTask(data));
    setShow(0);
  };
  const statuses = [
    { name: 'Started', style: 'warning' },
    { name: 'Done', style: 'success' },
    { name: 'Canceled', style: 'danger' },
  ];
  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleClose = () => {
    setShow(0);
  };
  const handleShow = (taskId) => {
    setShow(taskId);
    const task = dayTasks.find((task) => task.id === taskId);
    if (task.status === 'success') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };
  const handleUpdateTask = (dayTaskId, taskId) => {
    const data = {
      accessToken: user.accessToken,
      dayTaskId,
      dayTask: {
        status,
        comment,
        taskId,
      },
    };
    dispatch(updateDayTask(data));
    setComment('');
    setStatus('');
    setShow(0);
  };
  return (
    <Container>
        {tasksStatus === 'pending' &&      <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>} 
    {tasksStatus === 'idle' &&
    <Container>
              <Button as={Link} className="mt-3" to="../notes">Switch to Notes</Button> 
      <Row>
        <Col xs={6}>Task Name:</Col>
        <Col>Start</Col>
        <Col>Finish</Col>
      </Row>
      <ListGroup>
        {dayTasks.length > 0 &&
          dayTasks.map((task) => {
            let startHours, startMinutes, finishHours, finishMinutes;
            if (task.start > 0) {
              startHours =
                Math.floor(task.start / 60) < 10
                  ? '0' + Math.floor(task.start / 60)
                  : Math.floor(task.start / 60);
              startMinutes =
                task.start % 60 < 10
                  ? '0' + (task.start % 60)
                  : task.start % 60;
              finishHours =
                Math.floor(task.finish / 60) < 10
                  ? '0' + Math.floor(task.finish / 60)
                  : Math.floor(task.finish / 60);
              finishMinutes =
                task.finish % 60 < 10
                  ? '0' + (task.finish % 60)
                  : task.finish % 60;
            }
            const findTask = tasks.find((t) => t.id === task.task_id);
            return (
              <div key={task.task_id + task.id}>
                <ListGroup.Item
                  action
                  variant={task.status}
                  onClick={() => handleShow(task.id)}
                  key={task.id + task.start}
                >
                  <Row>
                    <Col xs={6}>{findTask.name} </Col>

                    <Col>
                      {' '}
                      {task.start > 0 && startHours + ':' + startMinutes} {''}{' '}
                    </Col>
                    <Col>
                      {' '}
                      {task.finish > 0 &&
                        finishHours + ':' + finishMinutes}{' '}
                      {''}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <Modal
                  key={task.task_id}
                  show={show === task.id}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Edit task:</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Select
                      disabled={disabled}
                      key={task.id}
                      onChange={handleChangeStatus}
                      aria-label="Select goal"
                    >
                      <option value="light">Select status:</option>
                      {statuses.map((status) => {
                        return (
                          <option value={status.style} key={status.name}>
                            {status.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Form.Group
                      key={task.id + task.task_id}
                      className="mb-3"
                      controlId="formBasicName"
                    >
                      <Form.Label className="fs-5 text-dark">
                        Add comment:
                      </Form.Label>
                      <Form.Control
                        onChange={(e) => setComment(e.target.value)}
                        autoComplete="name"
                        value={comment}
                        type="text"
                        placeholder="Enter comment"
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="warning"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete Task
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateTask(task.id, task.task_id)}
                    >
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            );
          })}
      </ListGroup>
      <Form className="taskForm">
        <Form.Label className="fs-5">Add tasks:</Form.Label>
        <Form.Select onChange={handleChange} aria-label="Select task">
          <option value={0}>Add Task</option>
          {tasks.map((task) => {
            return (
              <option value={task.id} key={task.id}>
                {task.name}
              </option>
            );
          })}
        </Form.Select>
        Set time:
        <TimeRangePicker
          value={time}
          className="timePicker"
          disableClock={true}
          onChange={setTime}
          hourPlaceholder="00"
          minutePlaceholder="00"
        />
        (not required)
        <Button variant="warning" onClick={handleAddTask}>
          Add Task
        </Button>
        <Form.Text className="text-danger">
          {message}
          {dayTasksData.message}
        </Form.Text>
      </Form> </Container>}
    </Container>
  );
}
