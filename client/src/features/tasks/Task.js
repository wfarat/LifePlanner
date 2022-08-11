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


export default function Task() {
  const params = useParams();
  const { tasks } = useSelector(selectTasks);
  const user = useSelector(selectUser);
  const [keyName, setKeyName] = useState('');
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
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
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
    if (name === "repeat") {
      setVal([]);
    }
    if (name === "duration") {
      setVal(0);
    }
    if (name === "name" || name === "description") {
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
          keyName
        }
      }
      dispatch(updateTask(data));
      setShow(false);
      setVal('');
    }
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Are you sure?</Popover.Header>
      <Popover.Body>
        This action is irreversible, it will{' '}
        <strong>remove all your progress and plans for this task.</strong>
        If you are sure click: <Button onClick={handleDelete}>Delete</Button>
      </Popover.Body>
    </Popover>
  );
  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Edit {keyName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(keyName === "name" || keyName === "description") &&
        <Form.Control
          onChange={(e) => setVal(e.target.value)}
          autoComplete="name"
          value={val}
          type="text"
          placeholder={`Enter ${keyName}`}
        /> }
        {keyName === "duration" &&
        <Form.Group>
              <Form.Label className="text-dark">Duration: {val} minutes</Form.Label>
              <Form.Range
                value={val}
                onChange={(e) => setVal(e.target.value)}
                max="120"
              />
              </Form.Group>
}
{keyName === "repeat" && days.map((day, index) => (
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
      ))
}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col>
        <h4>Edit task:</h4></Col>
      </Row>
      <ListGroup className="mb-3">
        <ListGroup.Item action as={Button} onClick={(e) => handleShow("name")}>        <div className="ms-2 me-auto">
          <div className="fw-bold">Name:</div>
          {task.name}
        </div></ListGroup.Item>
<ListGroup.Item action as={Button} onClick={(e) => handleShow("description")}>
<div className="ms-2 me-auto">
          <div className="fw-bold">Description:</div>
          {task.description}
        </div>
</ListGroup.Item>
<ListGroup.Item action as={Button} onClick={(e) => handleShow("duration")}>
<div className="ms-2 me-auto">
          <div className="fw-bold">Duration:</div>
          {task.duration} Minutes
        </div>
</ListGroup.Item>
<ListGroup.Item action as={Button} onClick={(e) => handleShow("repeat")}>        <div className="ms-2 me-auto">
          <div className="fw-bold">Days to repeat:</div>
          {task.repeat.length > 0 && task.repeat.map(day => {
            return days[day] + ' '
          })}    {task.repeat.length === 0 && 'No days selected.'}
        </div>
</ListGroup.Item>
      </ListGroup>
      <Row>
        <Col>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Button variant="success">Delete Task</Button>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}
