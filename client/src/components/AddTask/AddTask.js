import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './addTask.css';
import { selectGoals } from '../../features/Goals/goalsSlice';
import { addTask, selectTasks } from '../../features/tasks/tasksSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import Container from 'react-bootstrap/esm/Container';
export default function AddTask() {
  const user = useSelector(selectUser);
  const params = useParams();
  const { goals } = useSelector(selectGoals);
  const tasksData = useSelector(selectTasks);
  const { tasks } = tasksData;
  const intl = useIntl();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [times, setTimes] = useState(1);
  const [message, setMessage] = useState('');
  const linkGoal = goals.find((goal) => goal.id === Number(params.goalId));
  const [goal, setGoal] = useState(null);
  const [repeat, setRepeat] = useState([]);
  const dispatch = useDispatch();
  const days = [
    intl.formatMessage({ id: 'days.sunday' }),
    intl.formatMessage({ id: 'days.monday' }),
    intl.formatMessage({ id: 'days.tuesday' }),
    intl.formatMessage({ id: 'days.wednesday' }),
    intl.formatMessage({ id: 'days.thursday' }),
    intl.formatMessage({ id: 'days.friday' }),
    intl.formatMessage({ id: 'days.saturday' }),
  ];
  useEffect(() => {
    if (linkGoal) {
      setGoal(linkGoal.id);
    }
  }, [linkGoal]);
  const handleChange = (e) => {
    const value = e.target.value;
    const index = repeat.findIndex((val) => val === value);
    if (index === -1) {
      setRepeat([...repeat, value]);
    } else {
      setRepeat(repeat.filter((val) => val !== value));
    }
  };
  const handleGoal = (e) => {
    if (e.target.value === 'null') {
      setGoal(null);
    } else {
      setGoal(e.target.value);
    }
  };
  const handleClick = async () => {
    if (tasks.findIndex((task) => task.name === name) === -1) {
      if (name) {
        if (!description) {
          setDescription(intl.formatMessage({ id: 'description.empty' }));
        }
        setMessage('');
        const data = {
          accessToken: user.accessToken,
          task: {
            name,
            description,
            duration,
            repeat,
            goal,
            times,
          },
        };
        dispatch(addTask(data));
        if (linkGoal) {
          navigate(`../../goals/${linkGoal.id}`);
        } else if (params.dayRef) {
          navigate(`../../../day/${params.dayRef}/${name}`);
        } else {
          navigate('../tasks/');
        }
      } else {
        setMessage(intl.formatMessage({ id: 'message.taskname' }));
      }
    } else {
      setMessage(intl.formatMessage({ id: 'message.taskexists' }));
    }
  };
  return (
    <Container>
      <Form className="taskForm">
        <Form.Text className="fs-5 text-light">
          <FormattedMessage id="tasks.add" />
        </Form.Text>
        <Form.Group className="mb-2" controlId="formBasicName">
          <Form.Label>
            <FormattedMessage id="tasks.name" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            value={name}
            type="text"
            placeholder={intl.formatMessage({ id: 'tasks.nameplaceholder' })}
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
              id: 'tasks.descriptionplaceholder',
            })}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formDuration">
          <Form.Label>
            <FormattedMessage id="tasks.duration" values={{ duration }} />
          </Form.Label>
          <Form.Range
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            max="120"
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="fromRepeat">
          <Form.Label>
            <FormattedMessage id="tasks.repeat" />
          </Form.Label>
          {days.map((day, index) => (
            <Form.Check
              inline
              label={day}
              value={index}
              onChange={handleChange}
              name={day}
              key={index}
              type="checkbox"
              id={`inline-checkbox-${index}`}
            />
          ))}
        </Form.Group>
        <Form.Select
          onChange={handleGoal}
          className="mb-2"
          aria-label="Select goal"
        >
          {!linkGoal && (
            <option value="null">
              <FormattedMessage id="goals.select" />
            </option>
          )}
          {linkGoal && <option value={linkGoal.id}>{linkGoal.name}</option>}
          {goals.map((goal) => {
            return (
              <option value={goal.id} key={goal.id}>
                {goal.name}
              </option>
            );
          })}
        </Form.Select>
        <Form.Label>
          <FormattedMessage id="goals.times" values={{ times }} />
        </Form.Label>
        <Form.Range
          value={times}
          onChange={(e) => setTimes(e.target.value)}
          min="1"
          max="100"
        />
        <Form.Text className="text-danger">
          {message}
          {tasksData.message}
        </Form.Text>
        <Button variant="success" onClick={handleClick}>
          <FormattedMessage id="button.submit" />
        </Button>
      </Form>
    </Container>
  );
}
