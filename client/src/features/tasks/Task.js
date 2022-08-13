import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../users/userSlice';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { selectTasks, deleteTask, updateTask } from '../tasks/tasksSlice';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export default function Task() {
  const params = useParams();
  const { tasks } = useSelector(selectTasks);
  const user = useSelector(selectUser);
  const [keyName, setKeyName] = useState('');
  const intl = useIntl();
  const [val, setVal] = useState('');
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const task = tasks.find((task) => task.id === Number(params.taskId));
  const handleDelete = () => {
    const data = {
      taskId: params.taskId,
      accessToken: user.accessToken,
    };
    dispatch(deleteTask(data));
    navigate('../tasks');
  };
  const keyNameDisplay = (keyName === "name")? intl.formatMessage({id: "modal.name"}) : (keyName === "description") ?
  intl.formatMessage({id: "modal.description"}) : (keyName === "duration") ? intl.formatMessage({id: "modal.duration"}) : intl.formatMessage({id: "modal.repeat"});
  const days = [
    intl.formatMessage({id: "days.monday"}),
    intl.formatMessage({id: "days.tuesday"}),
    intl.formatMessage({id: "days.wednesday"}),
    intl.formatMessage({id: "days.thursday"}),
    intl.formatMessage({id: "days.friday"}),
    intl.formatMessage({id: "days.saturday"}),
    intl.formatMessage({id: "days.sunday"}),
  ];
  const handleClose = () => {
    setShow(false);
    setVal('');
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const index = val.findIndex((val) => val === value);
    if (index === -1) {
      setVal([...val, value]);
    } else {
      setVal(val.filter((val) => val !== value));
    }
  };
  const handleShow = (name) => {
    setKeyName(name);
    if (name === 'repeat') {
      setVal([]);
    }
    if (name === 'duration') {
      setVal(0);
    }
    if (name === 'name' || name === 'description') {
      setVal('');
    }
    setShow(true);
  };
  const handleUpdateTask = () => {
    if (val && keyName) {
      const data = {
        taskId: params.taskId,
        accessToken: user.accessToken,
        task: {
          val,
          keyName,
        },
      };
      dispatch(updateTask(data));
      setShow(false);
      setVal('');
    }
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3"><FormattedMessage id="popover.question" /></Popover.Header>
      <Popover.Body>
        <FormattedMessage id="popover.goal1" /> <strong><FormattedMessage id="popover.goal4" /></strong> <FormattedMessage id="popover.goal3" />
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
          {(keyName === 'name' || keyName === 'description') && (
            <Form.Control
              onChange={(e) => setVal(e.target.value)}
              autoComplete="name"
              value={val}
              type="text"
              placeholder={intl.formatMessage({id: "goal.editplaceholder"}, {keyNameDisplay})}
            />
          )}
          {keyName === 'duration' && (
            <Form.Group>
              <Form.Label className="text-dark">
                <FormattedMessage id="modal.setduration" values={{val}} />
              </Form.Label>
              <Form.Range
                value={val}
                onChange={(e) => setVal(e.target.value)}
                max="120"
              />
            </Form.Group>
          )}
          {keyName === 'repeat' &&
            days.map((day, index) => (
              <Form.Check
                inline
                label={day}
                value={index}
                onChange={handleChange}
                className="text-dark"
                name={day}
                key={index}
                type="checkbox"
                id={`inline-checkbox-${index}`}
              />
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FormattedMessage id="button.close" />
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            <FormattedMessage id="button.savechanges" />
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col>
          <h4><FormattedMessage id="task.edit" /></h4>
        </Col>
      </Row>
      <ListGroup className="mb-3">
        <ListGroup.Item action as={Button} onClick={(e) => handleShow('name')}>
          {' '}
          <div className="ms-2 me-auto">
            <div className="fw-bold"><FormattedMessage id="tasks.name"/></div>
            {task.name}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          action
          as={Button}
          onClick={(e) => handleShow('description')}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold"><FormattedMessage id="form.description" /></div>
            {task.description}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          action
          as={Button}
          onClick={(e) => handleShow('duration')}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold"><FormattedMessage id="task.duration" /></div>
            {task.duration} <FormattedMessage id="task.minutes" />
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          action
          as={Button}
          onClick={(e) => handleShow('repeat')}
        >
          {' '}
          <div className="ms-2 me-auto">
            <div className="fw-bold"><FormattedMessage id="tasks.repeat" /></div>
            {task.repeat.length > 0 &&
              task.repeat.map((day) => {
                return days[day] + ' ';
              })}{' '}
            {task.repeat.length === 0 && 'No days selected.'}
          </div>
        </ListGroup.Item>
      </ListGroup>
      <Row>
        <Col>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Button variant="danger"><FormattedMessage id="button.deletetask" /></Button>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}
