import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addNote, selectNotes } from '../../features/notes/notesSlice';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
export default function AddNote() {
  const user = useSelector(selectUser);
  const notesData = useSelector(selectNotes);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const intl = useIntl();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const handleClick = async () => {
    if (content && title) {
      setMessage('');
      const data = {
        accessToken: user.accessToken,
        note: {
          title,
          content,
        },
      };
      dispatch(addNote(data));
      navigate('../user/notes/');
    } else {
      setMessage('Content and title cannot be empty.');
    }
  };
  return (
    <Form className="taskForm">
      <Form.Text className="fs-5 text-light"><FormattedMessage id="notes.add"/></Form.Text>
      <Form.Group className="mb-3" controlId="formBasicTitle">
                      <Form.Label className="text-light"><FormattedMessage id="note.title" /></Form.Label>
                      <Form.Control
                        onChange={(e) => setTitle(e.target.value)}
                        autoComplete="title"
                        value={title}
                        type="text"
                        placeholder={intl.formatMessage({id: "note.titleplaceholder"})}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formContent">
                      <Form.Label className="text-light"><FormattedMessage id="note.content" /></Form.Label>
                      <Form.Control
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        as="textarea"
                        rows={3}
                        placeholder={intl.formatMessage({id: "note.contentplaceholder"})}
                      />
                    </Form.Group>
      <Form.Text className="text-danger">
        {message}
        {notesData.message}
      </Form.Text>
      <Button variant="success" onClick={handleClick}>
        <FormattedMessage id="button.submit" />
      </Button>
    </Form>
  );
}
