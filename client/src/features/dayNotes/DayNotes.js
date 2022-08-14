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
import { FormattedMessage, useIntl } from 'react-intl';
export default function DayNotes() {
  const user = useSelector(selectUser);
  const { day } = useSelector(selectDay);
  const intl = useIntl();
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
      setMessage(intl.formatMessage({ id: 'message.content' }));
      return;
    }
    if (title === '') {
      setTitle(intl.formatMessage({ id: 'note.untitled' }));
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
      setMessage(intl.formatMessage({ id: 'message.content' }));
      return;
    }
    if (title === '') {
      setTitle(intl.formatMessage({ id: 'note.untitled' }));
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
      <Button as={Link} variant="success" className="mb-3" to="../">
        <FormattedMessage id="notes.switch" />
      </Button>
      <ListGroup>
        {dayNotes.length > 0 &&
          dayNotes.map((note) => {
            return (
              <Container key={note.id}>
                <Modal show={show === note.id} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-dark">
                      <FormattedMessage id="note.edit" />
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicTitle">
                      <Form.Label className="text-dark">
                        <FormattedMessage id="note.title" />
                      </Form.Label>
                      <Form.Control
                        onChange={(e) => setTitle(e.target.value)}
                        autoComplete="title"
                        value={title}
                        type="text"
                        placeholder={intl.formatMessage({
                          id: 'note.titleplaceholder',
                        })}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formContent">
                      <Form.Label className="text-dark">
                        <FormattedMessage id="note.content" />
                      </Form.Label>
                      <Form.Control
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        as="textarea"
                        rows={3}
                        placeholder={intl.formatMessage({
                          id: 'note.contentplaceholder',
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
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <FormattedMessage id="button.deletenote" />
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateNote(note.id)}
                    >
                      <FormattedMessage id="button.savechanges" />
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
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{note.title}</div>
                        {note.content}
                      </div>
                    </ListGroup.Item>
                  </Col>
                </Row>
              </Container>
            );
          })}
      </ListGroup>
      <Form.Label className="fs-5">
        <FormattedMessage id="notes.add" />
      </Form.Label>
      <Form.Group className="mb-3" controlId="formBasicTitle">
        <Form.Label>
          <FormattedMessage id="note.title" />
        </Form.Label>
        <Form.Control
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="title"
          value={title}
          type="text"
          placeholder={intl.formatMessage({ id: 'note.titleplaceholder' })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formContent">
        <Form.Label>
          <FormattedMessage id="note.content" />
        </Form.Label>
        <Form.Control
          onChange={(e) => setContent(e.target.value)}
          value={content}
          as="textarea"
          rows={3}
          placeholder={intl.formatMessage({ id: 'note.contentplaceholder' })}
        />
      </Form.Group>
      <Button variant="success" onClick={handleAddNote}>
        <FormattedMessage id="button.addnote" />
      </Button>
      <Form.Text className="text-danger">{message}</Form.Text>
    </Container>
  );
}
