import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../users/userSlice';
import {
  addGoalTask,
  deleteGoal,
  getGoalTasks,
  selectGoals,
  updateGoal,
} from './goalsSlice';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useParams, Link, useNavigate, Outlet } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { selectTasks } from '../tasks/tasksSlice';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import AddGoalTask from '../../components/AddGoalTask/AddGoalTask';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { FormattedMessage, useIntl } from 'react-intl';
export default function Goal() {
  const params = useParams();
  const goalsData = useSelector(selectGoals);
  const { tasks } = useSelector(selectTasks);
  const intl = useIntl();
  const { goals, goalTasks } = goalsData;
  const user = useSelector(selectUser);
  const [keyName, setKeyName] = useState('');
  const [val, setVal] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const keyNameDisplay =
    keyName === 'name'
      ? intl.formatMessage({ id: 'modal.name' })
      : intl.formatMessage({ id: 'modal.description' });
  const goal = goals.find((goal) => goal.id === Number(params.goalId));
  useEffect(() => {
    const data = {
      goalId: params.goalId,
      accessToken: user.accessToken,
    };
    dispatch(getGoalTasks(data));
  }, [params.goalId]);
  const handleShow = (name) => {
    setKeyName(name);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setVal('');
  };
  const handleAddTask = (task, times) => {
    console.log(task.id);
    if (
      goalTasks.findIndex((goal) => goal.task_id === Number(task.id)) === -1
    ) {
      if (task.id === 'null') {
        setMessage(intl.formatMessage({ id: 'message.task' }));
        return;
      }
      const data = {
        goalId: params.goalId,
        accessToken: user.accessToken,
        goalTask: {
          taskId: task.id,
          times: times,
        },
      };
      dispatch(addGoalTask(data));
    } else {
      setMessage(intl.formatMessage({ id: 'message.taskadded' }));
    }
  };
  const handleUpdateGoal = () => {
    if (val && keyName) {
      const data = {
        goalId: params.goalId,
        accessToken: user.accessToken,
        goal: {
          val,
          keyName,
        },
      };
      dispatch(updateGoal(data));
      setShow(false);
      setVal('');
    }
  };
  const handleDelete = () => {
    const data = {
      goalId: params.goalId,
      accessToken: user.accessToken,
    };
    dispatch(deleteGoal(data));
    navigate('../goals');
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">
        <FormattedMessage id="popover.question" />
      </Popover.Header>
      <Popover.Body>
        <FormattedMessage id="popover.goal1" />{' '}
        <strong>
          <FormattedMessage id="popover.goal2" />
        </strong>{' '}
        <FormattedMessage id="popover.goal3" />
        <Button variant="danger" onClick={handleDelete}>
          <FormattedMessage id="popover.delete" />
        </Button>
      </Popover.Body>
    </Popover>
  );
  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">
            <FormattedMessage id="goal.edit" values={{ keyNameDisplay }} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            onChange={(e) => setVal(e.target.value)}
            autoComplete="name"
            value={val}
            type="text"
            placeholder={intl.formatMessage(
              { id: 'goal.editplaceholder' },
              { keyNameDisplay }
            )}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FormattedMessage id="button.close" />
          </Button>
          <Button variant="primary" onClick={handleUpdateGoal}>
            <FormattedMessage id="button.savechanges" />
          </Button>
        </Modal.Footer>
      </Modal>
      <ListGroup className="mb-3">
        <ListGroup.Item action as={Button} onClick={(e) => handleShow('name')}>
          {' '}
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              <FormattedMessage id="goals.name" />
            </div>
            {goal.name}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          action
          as={Button}
          onClick={(e) => handleShow('description')}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              <FormattedMessage id="form.description" />
            </div>
            {goal.description}
          </div>
        </ListGroup.Item>
      </ListGroup>
      <Row className="border-bottom border-secondary">
        <Col>
          <FormattedMessage id="tasks.name" />
        </Col>
        <Col>
          <FormattedMessage id="goals.progress" />
        </Col>
      </Row>
      {goalTasks.length > 0 &&
        goalTasks.map((goalTask) => {
          const task = tasks.find((task) => task.id === goalTask.task_id);
          const progress = (goalTask.done / goalTask.times) * 100;
          return (
            <Row
              key={goalTask.id}
              as={Link}
              to={`${goalTask.id}/remove`}
              className="border-bottom border-secondary listLink"
            >
              {task && <Col>{task.name}</Col>}
              <Col className="justify">
                <ProgressBar
                  style={{ margin: '3px' }}
                  animated
                  variant={progress === 100 ? 'success' : 'warning'}
                  now={progress}
                  label={`${progress}%`}
                />
              </Col>
            </Row>
          );
        })}
      <AddGoalTask tasksArray={[]} handleAddTask={handleAddTask} />
      <p className="text-danger">
        {goalsData.message} {message}
      </p>
      <Row>
        <Col>
          <Button
            variant="warning"
            as={Link}
            to={`../../tasks/add/${params.goalId}`}
          >
            <FormattedMessage id="button.addnewtask" />
          </Button>
        </Col>
        <Col>
          {' '}
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Button variant="danger">
              <FormattedMessage id="button.deletegoal" />
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
      <Outlet />
    </Container>
  );
}
