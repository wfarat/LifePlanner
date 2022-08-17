import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';

import { Link, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import {
  selectTasks,
  selectTasksStatus,
} from '../../features/tasks/tasksSlice';
import { addDayTask, getDayTasks, selectDayTasks } from './dayTasksSlice';
import { selectDay } from '../day/daySlice';
import { FormattedMessage, useIntl } from 'react-intl';
import DayTaskList from '../../components/DayTaskList/DayTaskList';

export default function DayTasks() {
  const user = useSelector(selectUser);
  const intl = useIntl();
  const params = useParams();
  const tasksStatus = useSelector(selectTasksStatus);
  const { day } = useSelector(selectDay);
  const dayTasksData = useSelector(selectDayTasks);
  const { tasks } = useSelector(selectTasks);
  const [time, setTime] = useState([]);
  const [task, setTask] = useState(0);
  const newTask = tasks.find((task) => task.name === params.taskName);
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
            <Col xs={3}>
              <FormattedMessage id="tasks.start" />
            </Col>
            <Col xs={3}>
              <FormattedMessage id="tasks.finish" />
            </Col>
          </Row>
          <DayTaskList />
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
