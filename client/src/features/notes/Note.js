import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../users/userSlice';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { FormattedMessage, useIntl } from 'react-intl';
import { selectNotes, updateNote, deleteNote } from './notesSlice';
export default function Goal() {
  const params = useParams();
  const intl = useIntl();
  const notesData = useSelector(selectNotes);
  const { notes } = notesData;
  const user = useSelector(selectUser);
  const [keyName, setKeyName] = useState('');
  const [val, setVal] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const keyNameDisplay = (keyName === "title")? intl.formatMessage({id: "note.title"}) :
intl.formatMessage({id: "note.content"});
  const note = notes.find((note) => note.id === Number(params.noteId));
  const handleShow = (name) => {
    setKeyName(name);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setVal('');
  };
  const handleUpdateNote = () => {
    if (val && keyName) {
      const data = {
        noteId: params.noteId,
        accessToken: user.accessToken,
        note: {
          val,
          keyName,
        },
      };
      dispatch(updateNote(data));
      setShow(false);
      setVal('');
    }
  };
  const handleDelete = () => {
    const data = {
      noteId: params.noteId,
      accessToken: user.accessToken,
    };
    dispatch(deleteNote(data));
    navigate('../notes');
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3"><FormattedMessage id="popover.question"/></Popover.Header>
      <Popover.Body>
        <FormattedMessage id="popover.note1" />
        <Button variant="danger" onClick={handleDelete}><FormattedMessage id="popover.delete" /></Button>
      </Popover.Body>
    </Popover>
  );
  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark"><FormattedMessage id="goal.edit" values={{keyNameDisplay}} /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            onChange={(e) => setVal(e.target.value)}
            autoComplete="name"
            value={val}
            type="text"
            placeholder={intl.formatMessage({id: "goal.editplaceholder"}, {keyNameDisplay})}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FormattedMessage id="button.close" />
          </Button>
          <Button variant="primary" onClick={handleUpdateNote}>
            <FormattedMessage id="button.savechanges" />
          </Button>
        </Modal.Footer>
      </Modal>
      <ListGroup className="mb-3">
        <ListGroup.Item action as={Button} onClick={(e) => handleShow('title')}>
          {' '}
          <div className="ms-2 me-auto">
            <div className="fw-bold"><FormattedMessage id="note.title" /></div>
            {note.title}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          action
          as={Button}
          onClick={(e) => handleShow('content')}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold"><FormattedMessage id="note.content" /></div>
            {note.content}
          </div>
        </ListGroup.Item>
      </ListGroup>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Button variant="danger"><FormattedMessage id="button.deletenote" /></Button>
          </OverlayTrigger>
    </Container>
  );
}
