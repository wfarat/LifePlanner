import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './addTask.css';
import { addNote, selectNotes } from '../../features/notes/notesSlice';
export default function AddNote() {
  const user = useSelector(selectUser);
  const notesData = useSelector(selectNotes);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const handleClick = async () => {
      if (content && title) { 
        setMessage('');
      const data = {
          userId: user.user.id,
          accessToken: user.accessToken,
          note: {
          title,
          content,
          }
      }
      dispatch(addNote(data));
  } else {
  setMessage('Content and title cannot be empty.')
  }
  };
  return (
    <Form className="taskForm">
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
    <Form.Text className="text-danger">{message}{notesData.message}</Form.Text>
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
