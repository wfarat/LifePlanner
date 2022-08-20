import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/esm/Button';
import { selectUser } from '../../features/users/userSlice';
import { removeGoalTask } from '../../features/Goals/goalsSlice';
export default function RemoveGoalTask() {
  const params = useParams();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
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
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">
            <FormattedMessage id="goaltask.remove" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark">
          <FormattedMessage id="goaltask.question" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FormattedMessage id="button.close" />
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FormattedMessage id="button.removetask" />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
