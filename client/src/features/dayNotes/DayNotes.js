import React, { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectDayNotes,
  addDayNote,
  getDayNotes,
  deleteDayNote,
  updateDayNote,
} from '../dayNotes/dayNotesSlice';
import { selectUser } from '../users/userSlice';
import { selectDay } from '../day/daySlice';
export default function DayNotes() {
  const user = useSelector(selectUser);
  const {day} = useSelector(selectDay);
  const { dayNotes } = useSelector(selectDayNotes);
  const [show, setShow] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
      const data = {
        dayRef: day.day_ref,
        accessToken: user.accessToken,
      };
      dispatch(getDayNotes(data));
  }, [day.day_ref]);
  const handleShow = (id) => {
    setShow(id);
  };
  const handleClose = () => {
    setShow(0);
  };
  const handleDeleteNote = (id) => {
    const data = {
      accessToken: user.accessToken,
      dayNoteId: id,
    };
    dispatch(deleteDayNote(data));
  };
  const handleAddNote = () => {
    if (content === '') {
      setMessage('Content cannot be empty');
      return;
    }
    if (title === '') {
      setTitle('Untitled')
    }
      const data = {
        dayRef: day.day_ref,
        accessToken: user.accessToken,
        dayNote: {
          title,
          content,
        },
      };
      dispatch(addDayNote(data));
      setContent('');
      setTitle('');
      };
  const handleUpdateNote = (id) => {
    if (content === '') {
      setMessage('Content cannot be empty');
      return;
    }
    if (title === '') {
      setTitle('Untitled')
    }
      const data = {
        dayNoteId: id,
        accessToken: user.accessToken,
        dayNote: {
          title,
          content,
        },
      };
      dispatch(updateDayNote(data));
            setContent('');
      setTitle('');
  };
  return (
    <Container>
            <Button as={Link} className="mt-3" to="../">Switch to Tasks</Button> 
      <Row>
        <Col>
          <p className="fs-5">Notes:</p>
        </Col>
      </Row>
      <ListGroup>
        {dayNotes.length > 0 &&
          dayNotes.map((note) => {
            return (
              <Container>
                <Modal
                  key={note.id}
                  show={show === note.id}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title className="text-dark">Edit Note:</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicTitle">
                      <Form.Label className="text-dark">Title</Form.Label>
                      <Form.Control
                        onChange={(e) => setTitle(e.target.value)}
                        autoComplete="title"
                        value={title}
                        type="text"
                        placeholder="Enter title"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formContent">
                      <Form.Label className="text-dark">Content</Form.Label>
                      <Form.Control
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        as="textarea"
                        rows={3}
                        placeholder="Enter content"
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="warning"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      Delete Note
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateNote(note.id)}
                    >
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Row>
                  <Col>
                    <ListGroup.Item
                      action
                      onClick={() => {
                        handleShow(note.id);
                      }}
                      key={note.id}
                    >
                     {note.title}
                    </ListGroup.Item>
                  </Col>
                </Row>
              </Container>
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
      <Form.Text className="text-danger">{message}</Form.Text>
    </Container>
  );
}
