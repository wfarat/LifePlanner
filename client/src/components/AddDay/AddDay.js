import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { getTasks, selectTasks } from '../../features/tasks/tasksSlice';
import { addDay, selectDay } from '../../features/day/daySlice';
export default function AddDay(props) {
  const user = useSelector(selectUser);
  const dayData = useSelector(selectDay);
  const navigate = useNavigate();
  const { tasks } = useSelector(selectTasks);
  const [comment, setComment] = useState('');
  const [time, setTime] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [task, setTask] = useState({});
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const [noteNumber, setNoteNumber] = useState(0);
  const [tasksArray, setTasksArray] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (tasks.length === 0) {
      const data = {
        accessToken: user.accessToken,
      };
      dispatch(getTasks(data));
    }
  }, []);
  const handleClick = async () => {
    const data = {
      accessToken: user.accessToken,
      dayRef: props.dayRef,
      day: {
        tasks: tasksArray,
        comment,
        notes,
      },
    };
    dispatch(addDay(data));
    navigate(`/calendar`);
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
    if (time.length === 0) {
      const taskObj = { id: task.id, name: task.name };
      setTasksArray([...tasksArray, taskObj]);
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
      const taskObj = {
        id: task.id,
        name: task.name,
        start: startTotal,
        finish: finishTotal,
      };
      setTasksArray([...tasksArray, taskObj]);
    }
  };
  const handleDeleteNote = (note) => {
    setNotes(notes.filter((val) => val.id !== note));
  };
  const handleAddNote = () => {
    if (content === '') {
      setMessage('Content cannot be empty');
      return;
    }
    const noteObj = { title, content, id: noteNumber };
    setNotes([...notes, noteObj]);
    setNoteNumber(noteNumber + 1);
  };
  const handleDeleteTask = (task) => {
    setTasksArray(tasksArray.filter((val) => val !== task));
  };
  return (
    <Form className="taskForm">
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label className="fs-5">Add comment:</Form.Label>
        <Form.Control
          onChange={(e) => setComment(e.target.value)}
          autoComplete="name"
          value={comment}
          type="text"
          placeholder="Enter comment"
        />
      </Form.Group>
      <Form.Label className="fs-5">Add tasks:</Form.Label>
      <Form.Select onChange={handleChange} aria-label="Select task">
        <option value={'null'}>Add Task</option>
        {tasks.map((task) => {
          return (
            <option value={`${task.id}|${task.name}`} key={task.id}>
              {task.name}
            </option>
          );
        })}
      </Form.Select>
      Set time:
      <TimeRangePicker value={time} className="timePicker" disableClock={true} onChange={setTime} hourPlaceholder="00" minutePlaceholder="00" />
      (not required)
      <Button variant="warning" onClick={handleAddTask}>
        Add Task
      </Button>
      <ListGroup>
        {tasksArray.length > 0 &&
          tasksArray.map((task) => {
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
            return (
              <ListGroup.Item
                action
                onClick={() => {
                  handleDeleteTask(task);
                }}
                key={task.id + task.start}
              >
                {task.name}{' '}
                {task.start > 0 &&
                  startHours +
                    ':' +
                    startMinutes +
                    '-' +
                    finishHours +
                    ':' +
                    finishMinutes}
              </ListGroup.Item>
            );
          })}
      </ListGroup>
      <Form.Label className="fs-5">Add notes:</Form.Label>
      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="title"
          value={title}
          type="text"
          placeholder="Enter title"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formContent">
        <Form.Label>Content</Form.Label>
        <Form.Control
          onChange={(e) => setContent(e.target.value)}
          value={content}
          as="textarea"
          rows={3}
          placeholder="Enter content"
        />
      </Form.Group>
      <Button variant="warning" onClick={handleAddNote}>
        Add Note
      </Button>
      <ListGroup>
        {notes.length > 0 &&
          notes.map((note) => {
            const popover = (
              <Popover id="popover-basic">
                <Popover.Header as="h3">{note.title}</Popover.Header>
                <Popover.Body>{note.content}</Popover.Body>
              </Popover>
            );
            return (
              <Container>
                <Row>
                  <Col>
                    <ListGroup.Item
                      action
                      onClick={() => {
                        handleDeleteNote(note.id);
                      }}
                      key={note.id}
                    >
                      {!note.title && 'Untitled note'} {note.title}
                    </ListGroup.Item>
                  </Col>
                  <Col>
                    <OverlayTrigger
                      trigger="click"
                      placement="bottom"
                      overlay={popover}
                    >
                      <Button variant="success">Read Note</Button>
                    </OverlayTrigger>
                  </Col>
                </Row>
              </Container>
            );
          })}
      </ListGroup>
      <Form.Text className="text-danger">
        {message}
        {dayData.message}
      </Form.Text>
      <Button variant="success" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
