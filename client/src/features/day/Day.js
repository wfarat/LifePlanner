import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Form from 'react-bootstrap/esm/Form';
import Col from 'react-bootstrap/esm/Col';
import Modal from 'react-bootstrap/esm/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import AddDay from '../../components/AddDay/AddDay';
import Popover from 'react-bootstrap/esm/Popover';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Button from 'react-bootstrap/esm/Button';
import { selectUser } from '../users/userSlice';
import { getDay, selectDay, updateDayTask } from './daySlice';
import { selectTasks } from '../tasks/tasksSlice';

export default function Day() {
  const dayData = useSelector(selectDay);
  const { day, dayTasks, dayNotes } = dayData;
  const dispatch = useDispatch();
  const { tasks } = useSelector(selectTasks);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [show, setShow] = useState(false);
  const user = useSelector(selectUser);
  const params = useParams();
  useEffect(() => {
    if (dayTasks.length === 0) {
      const data = {
        dayRef: params.dayRef,
        accessToken: user.accessToken,
      };
      dispatch(getDay(data));
    }
  }, [params.dayRef]);
  const statuses = [
    { name: 'Started', color: 'warning' },
    { name: 'Done', color: 'success' },
    { name: 'Canceled', color: 'danger' },
  ];
  const handleChange = (e) => {
    setStatus(e.target.value);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleUpdateTask = (taskId) => {
    const data = {
      dayRef: params.dayRef,
      accessToken: user.accessToken,
      dayTask: {
        status,
        comment,
        taskId,
      },
    };
    dispatch(updateDayTask(data));
    setShow(false);
  };
  const handleNote = () => {};
  return (
    <div>
      {day && (
        <Container>
          <Row>
            <Col>
              <p className="fs-5"> {day.comment} </p>
            </Col>
          </Row>
          <Row>
            <Col>Task Name:</Col>
            <Col>Start</Col>
            <Col>Finish</Col>
          </Row>
          <ListGroup>
            {dayTasks.length > 0 &&
              dayTasks.map((task) => {
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
                const findTask = tasks.find((t) => t.id === task.task_id);
                return (
                  <div key={task.task_id + task.id}>
                    <ListGroup.Item
                      action
                      variant={task.status}
                      onClick={handleShow}
                      key={task.id + task.start}
                    >
                      <Row>
                        <Col>{findTask.name} </Col>

                        <Col>
                          {' '}
                          {task.start > 0 &&
                            startHours + ':' + startMinutes}{' '}
                          {''}{' '}
                        </Col>
                        <Col>
                          {' '}
                          {task.finish > 0 &&
                            finishHours + ':' + finishMinutes}{' '}
                          {''}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <Modal key={task.task_id} show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-dark">
                          Modal heading
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {statuses.map((status) => (
                          <Form.Check
                            inline
                            label={status.name}
                            value={status.color}
                            onChange={handleChange}
                            className="text-dark"
                            name={status.name}
                            key={status.name}
                            type="radio"
                            id={`inline-radio-${status.name}`}
                          />
                        ))}
                        <Form.Group className="mb-3" controlId="formBasicName">
                          <Form.Label className="fs-5 text-dark">
                            Add comment:
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setComment(e.target.value)}
                            autoComplete="name"
                            value={comment}
                            type="text"
                            placeholder="Enter comment"
                          />
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleUpdateTask(task.id)}
                        >
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                );
              })}
          </ListGroup>
          <Row>
            <Col>
              <p className="fs-5">Notes:</p>
            </Col>
          </Row>
          <ListGroup>
            {dayNotes.length > 0 &&
              dayNotes.map((note) => {
                const popover = (
                  <Popover id="popover-basic">
                    <Popover.Header className="text-black" as="h3">
                      {note.title}
                    </Popover.Header>
                    <Popover.Body>{note.content}</Popover.Body>
                  </Popover>
                );
                return (
                  <Container>
                    <Row>
                      <Col xs={8}>
                        <ListGroup.Item
                          action
                          onClick={() => {
                            handleNote(note.id);
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
                          <Button key={note.id} variant="success">
                            Read Note
                          </Button>
                        </OverlayTrigger>
                      </Col>
                    </Row>
                  </Container>
                );
              })}
          </ListGroup>
        </Container>
      )}
      {!day && <AddDay dayRef={params.dayRef} />}
    </div>
  );
}
