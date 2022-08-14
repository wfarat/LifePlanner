import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import {
  selectTasks,
  selectTasksStatus,
} from '../../features/tasks/tasksSlice';
import {
  addDayTask,
  deleteDayTask,
  getDayTasks,
  selectDayTasks,
  updateDayTask,
} from './dayTasksSlice';
import { selectDay } from '../day/daySlice';
import { FormattedMessage, useIntl } from 'react-intl';

export default function DayTasks() {
  const user = useSelector(selectUser);
  const intl = useIntl();
  const params = useParams();
  const tasksStatus = useSelector(selectTasksStatus);
  const { day } = useSelector(selectDay);
  const dayTasksData = useSelector(selectDayTasks);
  const { dayTasks } = dayTasksData;
  const { tasks } = useSelector(selectTasks);
  const [time, setTime] = useState([]);
  const [task, setTask] = useState(0);
  const [status, setStatus] = useState('');
  const newTask = tasks.find((task) => task.name === params.taskName);
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
      setMessage(intl.formatMessage({ id: 'message.task' }));
      return;
    }
    if (time.length === 0) {
      const data = {
        accessToken: user.accessToken,
        dayRef: day.day_ref,
        dayTask: { taskId: task },
      };
      dispatch(addDayTask(data));
    } else if (time[0] === null || time[1] === null) {
      setMessage(intl.formatMessage({ id: 'message.picktime' }));
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
        setMessage(intl.formatMessage({ id: 'message.time' }));
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
    { name: intl.formatMessage({ id: 'status.started' }), style: 'warning' },
    { name: intl.formatMessage({ id: 'status.done' }), style: 'success' },
    { name: intl.formatMessage({ id: 'status.canceled' }), style: 'danger' },
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
  const handleUpdateTask = (dayTaskId, taskId, duration) => {
    let start, finish;
    const now = new Date();
    if (status === 'warning') {
      start = now.getHours() * 60 + (now.getMinutes() + 1);
      finish = start + duration;
    } else {
      finish = now.getHours() * 60 + (now.getMinutes() + 1);
    }
    const data = {
      accessToken: user.accessToken,
      dayTaskId,
      dayTask: {
        status,
        comment,
        taskId,
        start,
        finish,
      },
    };
    dispatch(updateDayTask(data));
    setComment('');
    setStatus('');
    setShow(0);
  };
  return (
    <div>
      {tasksStatus === 'pending' && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {tasksStatus === 'idle' && (
        <Container>
          <Button as={Link} variant="success" className="mb-3" to="../notes">
            <FormattedMessage id="tasks.switch" />
          </Button>
          <Row>
            <Col xs={6}>
              <FormattedMessage id="tasks.name" />
            </Col>
            <Col>
              <FormattedMessage id="tasks.start" />
            </Col>
            <Col>
              <FormattedMessage id="tasks.finish" />
            </Col>
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
                  <div key={task.task_id + '' + task.id}>
                    {findTask && (
                      <div>
                        <ListGroup.Item
                          action
                          variant={task.status}
                          onClick={() => handleShow(task.id)}
                          key={task.id + '' + task.start}
                        >
                          <Row>
                            <Col xs={6}>{findTask.name} </Col>

                            <Col>
                              {' '}
                              {task.start > 0 &&
                                startHours + ':' + startMinutes}{' '}
                              {''}{' '}
                            </Col>
                            <Col>
                              {' '}
                              {task.finish > 0 &&
                                finishHours + ':' + finishMinutes}{' '}
                              {''}
                            </Col>
                          </Row>
                          {task.comment && (
                            <Row>
                              <Col>{task.comment}</Col>
                            </Row>
                          )}
                        </ListGroup.Item>
                        <Modal
                          key={task.task_id}
                          show={show === task.id}
                          onHide={handleClose}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title className="text-dark">
                              <FormattedMessage id="tasks.edit" />
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form.Select
                              disabled={disabled}
                              key={task.id}
                              onChange={handleChangeStatus}
                              aria-label="Select goal"
                            >
                              <option value="light">
                                <FormattedMessage id="tasks.status" />
                              </option>
                              {statuses.map((status) => {
                                return (
                                  <option
                                    value={status.style}
                                    key={status.name}
                                  >
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
                                <FormattedMessage id="tasks.comment" />
                              </Form.Label>
                              <Form.Control
                                onChange={(e) => setComment(e.target.value)}
                                autoComplete="name"
                                value={comment}
                                type="text"
                                placeholder={intl.formatMessage({
                                  id: 'tasks.commentplaceholder',
                                })}
                              />
                            </Form.Group>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              <FormattedMessage id="button.close" />
                            </Button>
                            <Button
                              variant="warning"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <FormattedMessage id="button.deletetask" />
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleUpdateTask(
                                  task.id,
                                  task.task_id,
                                  findTask.duration
                                )
                              }
                            >
                              <FormattedMessage id="button.savechanges" />
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    )}
                  </div>
                );
              })}
          </ListGroup>
          <Form className="taskForm">
            <Form.Label className="fs-5">
              <FormattedMessage id="tasks.add" />
            </Form.Label>
            <Form.Select onChange={handleChange} aria-label="Select task">
              {!newTask && (
                <option value={0}>
                  <FormattedMessage id="tasks.select" />
                </option>
              )}
              {newTask && <option value={newTask.id}>{newTask.name}</option>}
              {tasks.map((task) => {
                return (
                  <option value={task.id} key={task.id}>
                    {task.name}
                  </option>
                );
              })}
            </Form.Select>
            <FormattedMessage id="tasks.time" />
            <TimeRangePicker
              value={time}
              className="timePicker"
              disableClock={true}
              onChange={setTime}
              hourPlaceholder="00"
              minutePlaceholder="00"
            />
            <FormattedMessage id="tasks.notrequired" />
            <Button variant="success" onClick={handleAddTask}>
              <FormattedMessage id="button.addtask" />
            </Button>
            <Form.Text className="text-danger">
              {message}
              {dayTasksData.message}
            </Form.Text>
          </Form>
          <Row>
            <Col>
              <Button
                variant="warning"
                as={Link}
                to={`../../tasks/add/day/${day.day_ref}`}
                className="mt-2"
              >
                <FormattedMessage id="button.addnewtask" />
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}
