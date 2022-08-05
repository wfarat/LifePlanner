import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { getTasks, selectTasks } from '../../features/tasks/tasksSlice';
import { addDay, selectDay } from '../../features/day/daySlice';
export default function AddDay(props) {
  const user = useSelector(selectUser);
  const dayData = useSelector(selectDay);
  const {tasks} = useSelector(selectTasks);
  const [comment, setComment] = useState('');
  const [start, setStart] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [finish, setFinish] = useState(0);
  const [task, setTask] = useState({});
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const [noteNumber, setNoteNumber] = useState(0);
  const [tasksArray, setTasksArray] = useState([]);
  const dispatch = useDispatch();  
  useEffect(() => {
    if (tasks.length === 0) {
      const data = {
        userId: user.user.id,
        accessToken: user.accessToken
      }
      dispatch(getTasks(data));
    }
  }, [])
  const handleClick = async () => {
    const data = {
        userId: user.user.id,
        accessToken: user.accessToken,
        dayRef: props.dayRef,
        day: {
            tasks: tasksArray,
            comment,
            notes
        }
    }
    dispatch(addDay(data));
  };
  const handleChange = (e) => {
    const newTask = e.target.value.split('|');
    setTask({id: newTask[0], name: newTask[1]});
  }
  const handleAddTask = () => {
    if (task.id === 'null') {
      setMessage('Pick a task');
      return;
    }
    if (finish < start) {
        setMessage('Task finish time must be after the start time.');
        return;
    }
      const taskObj = {id: task.id, name: task.name, start, finish};
        setTasksArray([...tasksArray, taskObj]);
  }
  const handleDeleteNote = (note) => {
    setNotes(notes.filter(val => val.id !== note));
  }
  const handleAddNote = () => {
    if (content === '') {
      setMessage('Content cannot be empty');
      return;
    }
      const noteObj = {title, content, id: noteNumber};
        setNotes([...notes, noteObj]);
        setNoteNumber(noteNumber + 1);
  }
  const handleDeleteTask = (task) => {
    setTasksArray(tasksArray.filter(val => val.id !== task));
  }
  return (
    <Form className="taskForm">
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Add comment:</Form.Label>
        <Form.Control
          onChange={(e) => setComment(e.target.value)}
          autoComplete="name"
          value={comment}
          type="text"
          placeholder="Enter comment"
        />
      </Form.Group>
      <Form.Select onChange={handleChange} aria-label="Select task">
      <option value={'null'}>Add Task</option>
      {tasks.map(task => {
        return <option value={`${task.id}|${task.name}`} key={task.id}>{task.name}</option>
      })}
    </Form.Select>
    <Form.Label>Set Start Time: {Math.floor(start / 60)}:{start % 60} (not required)</Form.Label>
    <Form.Range value={start} onChange={e => setStart(e.target.value)} max="1440"/>
    <Form.Label>Set Finish Time: {Math.floor(finish / 60)}:{finish % 60} (not required)</Form.Label>
    <Form.Range value={finish} onChange={e => setFinish(e.target.value)} max="1440"/>
    <Button variant="secondary" onClick={handleAddTask}>Add Task</Button>
    <ListGroup> 
    {tasksArray.length > 0 && 
          tasksArray.map(task => {
          return (<ListGroup.Item action onClick={() => {handleDeleteTask(task.id)}} key={task.id}>
            {task.name} {task.start> 0 && 'Start' + Math.floor(task.start / 60)+':'+task.start % 60 + '/Finish' + Math.floor(task.finish/60) + ':' + task.finish % 60}
          </ListGroup.Item>)
    })}
    </ListGroup>

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
    <Button variant="secondary" onClick={handleAddNote}>Add Note</Button>
    <ListGroup> 
    {notes.length > 0 && 
          notes.map(note => {
          return (<ListGroup.Item action onClick={() => {handleDeleteNote(note.id)}} key={note.id}>
            {note.title}
          </ListGroup.Item>)
    })}
    </ListGroup>
    <Form.Text className="text-danger">{message}{dayData.message}</Form.Text>
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
