import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { selectUser } from '../../features/users/userSlice';
import { editGoalTask, removeGoalTask } from '../../features/Goals/goalsSlice';
export default function EditGoalTask() {
  const params = useParams();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [times, setTimes] = useState(1);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  useEffect(() => {
    setShow(true);
  }, [params.goalTaskId]);
  const handleDelete = () => {
    const data = {
      goalTaskId: params.goalTaskId,
      accessToken: user.accessToken,
    };
    dispatch(removeGoalTask(data));
    setShow(false);
  };
  const handleUpdate = () => {
    const data = {
      goalTaskId: params.goalTaskId,
      accessToken: user.accessToken,
      goalTask: {times}
    };
    dispatch(editGoalTask(data));
    setShow(false);
  }
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">
        <FormattedMessage id="popover.question" />
      </Popover.Header>
      <Popover.Body>
        <strong>
          <FormattedMessage id="goaltask.question" />
        </strong>{' '}
        <Button variant="danger" onClick={handleDelete}>
          <FormattedMessage id="popover.delete" />
        </Button>
      </Popover.Body>
    </Popover>
  );
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">
            <FormattedMessage id="goaltask.edit" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark">
        <Form.Group as={Row}>
        <Form.Label column xs="8">
          <FormattedMessage id="goals.times" values={{ times }} />
        </Form.Label>
        <Col xs="4">
          <Form.Control
            onChange={(e) => setTimes(e.target.value)}
            value={times}
            type="number"
            min="1"
          />
        </Col>
      </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FormattedMessage id="button.close" />
          </Button>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <Button variant="danger">
            <FormattedMessage id="button.removetask" />
          </Button>
          </OverlayTrigger>
          <Button variant="primary" onClick={handleUpdate}>
            <FormattedMessage id="button.savechanges" />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
