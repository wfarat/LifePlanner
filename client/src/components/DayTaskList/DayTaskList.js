import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/form';
import { selectTasks } from '../../features/tasks/tasksSlice';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import { FormattedMessage, useIntl } from 'react-intl';
import { deleteDayTask, selectDayTasks, updateDayTask } from '../../features/dayTasks/dayTasksSlice';
import { selectUser } from '../../features/users/userSlice';
export default function DayTaskList () {
  const {tasks} = useSelector(selectTasks);
  const intl = useIntl();
  const { dayTasks, oneTimeTasks } = useSelector(selectDayTasks);
  const user = useSelector(selectUser);
  const [show, setShow] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [status, setStatus] = useState('');
  const handleDeleteTask = (dayTaskId, oneTime) => {
    const data = {
      accessToken: user.accessToken,
      dayTaskId,
      dayTask: {
      oneTime }
    };
    dispatch(deleteDayTask(data));
    setShow(0);
  };
  const statuses = [
    { name: intl.formatMessage({ id: 'status.started' }), style: 'warning' },
    { name: intl.formatMessage({ id: 'status.done' }), style: 'success' },
    { name: intl.formatMessage({ id: 'status.canceled' }), style: 'danger' },
  ];
  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleClose = () => {
    setShow(0);
  };
  const handleShow = (taskId, oneTime) => {
    setShow(taskId);
    let task;
    if (oneTime) {
      task = oneTimeTasks.find((task) => task.id === taskId);
    } else {
    task = dayTasks.find((task) => task.id === taskId);
    }
    if (task.status === 'success') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setStatus(task.status);
  };
  const handleUpdateTask = (dayTaskId, taskId, duration, oneTime) => {
    let start, finish;
    const now = new Date();
    if (status === 'warning') {
      start = now.getHours() * 60 + (now.getMinutes() + 1);
      if (duration > 0) {
      finish = start + duration;
      }
    } else {
      finish = now.getHours() * 60 + (now.getMinutes() + 1);
    }
    const data = {
      accessToken: user.accessToken,
      dayTaskId,
      dayTask: {
        status,
        comment,
        taskId,
        oneTime,
        start,
        finish,
      },
    };
    dispatch(updateDayTask(data));
    setComment('');
    setStatus('');
    setShow(0);
  };
return (
    <ListGroup>
      { oneTimeTasks.length > 0 &&
       oneTimeTasks.map((task) => {
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
        }
        if (task.finish > 0 ) {
          finishHours =
          Math.floor(task.finish / 60) < 10
            ? '0' + Math.floor(task.finish / 60)
            : Math.floor(task.finish / 60);
        finishMinutes =
          task.finish % 60 < 10
            ? '0' + (task.finish % 60)
            : task.finish % 60;
        }
        return (
          <div key={task.id}> 
                <ListGroup.Item
                  action
                  variant={task.status}
                  onClick={() => handleShow(task.id, true)}
                  key={task.id + '' + task.start}
                >
                  <Row>
                    <Col xs={6}>{task.name} </Col>
  
                    <Col>
                      {' '}
                      {task.start > 0 &&
                        startHours + ':' + startMinutes}{' '}
                      {''}{' '}
                    </Col>
                    <Col>
                      {' '}
                      {task.finish > 0  &&
                        finishHours + ':' + finishMinutes}{' '}
                      {''}
                    </Col>
                  </Row>
                  {task.comment && (
                    <Row>
                      <Col>{task.comment}</Col>
                    </Row>
                  )}
                </ListGroup.Item>
                <Modal
                  key={task.task_id}
                  show={show === task.id}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title className="text-dark">
                      <FormattedMessage id="tasks.edit" />
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Select
                      disabled={disabled}
                      key={task.id}
                      onChange={handleChangeStatus}
                      aria-label="Select goal"
                    >
                      <option value="light">
                        <FormattedMessage id="tasks.status" />
                      </option>
                      {statuses.map((status) => {
                        return (
                          <option
                            value={status.style}
                            key={status.name}
                          >
                            {status.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Form.Group
                      key={task.name}
                      className="mb-3"
                      controlId="formBasicName"
                    >
                      <Form.Label className="fs-5 text-dark">
                        <FormattedMessage id="tasks.comment" />
                      </Form.Label>
                      <Form.Control
                        onChange={(e) => setComment(e.target.value)}
                        autoComplete="name"
                        value={comment}
                        type="text"
                        placeholder={intl.formatMessage({
                          id: 'tasks.commentplaceholder',
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
                      onClick={() => handleDeleteTask(task.id, true)}
                    >
                      <FormattedMessage id="button.deletetask" />
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleUpdateTask(
                          task.id,
                          task.task_id,
                          0,
                          true
                        )
                      }
                    >
                      <FormattedMessage id="button.savechanges" />
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div> )}
            )} 
        
{dayTasks.length > 0 &&
    dayTasks.map((task) => {
      let startHours, startMinutes, finishHours, finishMinutes;
      if (task.finish > 0 || task.start > 0) {
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
        <div key={task.task_id + '' + task.id}>
          {findTask && (
            <div>
              <ListGroup.Item
                action
                variant={task.status}
                onClick={() => handleShow(task.id)}
                key={task.id + '' + task.start}
              >
                <Row>
                  <Col xs={6}>{findTask.name} </Col>

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
                {task.comment && (
                  <Row>
                    <Col>{task.comment}</Col>
                  </Row>
                )}
              </ListGroup.Item>
              <Modal
                key={task.task_id}
                show={show === task.id}
                onHide={handleClose}
              >
                <Modal.Header closeButton>
                  <Modal.Title className="text-dark">
                    <FormattedMessage id="tasks.edit" />
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Select
                    disabled={disabled}
                    key={task.id}
                    onChange={handleChangeStatus}
                    aria-label="Select goal"
                  >
                    <option value="light">
                      <FormattedMessage id="tasks.status" />
                    </option>
                    {statuses.map((status) => {
                      return (
                        <option
                          value={status.style}
                          key={status.name}
                        >
                          {status.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Group
                    key={task.id + task.task_id}
                    className="mb-3"
                    controlId="formBasicName"
                  >
                    <Form.Label className="fs-5 text-dark">
                      <FormattedMessage id="tasks.comment" />
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setComment(e.target.value)}
                      autoComplete="name"
                      value={comment}
                      type="text"
                      placeholder={intl.formatMessage({
                        id: 'tasks.commentplaceholder',
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
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <FormattedMessage id="button.deletetask" />
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleUpdateTask(
                        task.id,
                        task.task_id,
                        findTask.duration
                      )
                    }
                  >
                    <FormattedMessage id="button.savechanges" />
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </div>
      );
    })}
     </ListGroup> )
}