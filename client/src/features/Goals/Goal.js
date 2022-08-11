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
import { useParams, Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { selectTasks } from '../tasks/tasksSlice';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import AddGoalTask from '../../components/AddGoalTask/AddGoalTask';
import ProgressBar from 'react-bootstrap/ProgressBar';
export default function Goal() {
  const params = useParams();
  const goalsData = useSelector(selectGoals);
  const { tasks } = useSelector(selectTasks);
  const [tasksArray, setTasksArray] = useState([]);
  const { goals, goalTasks } = goalsData;
  const user = useSelector(selectUser);
  const [keyName, setKeyName] = useState('');
  const [val, setVal] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const handleClick = () => {
    if (tasksArray.length > 0) {
      tasksArray.forEach((task) => {
        const data = {
          goalId: params.goalId,
          accessToken: user.accessToken,
          goalTask: {
            taskId: task.id,
            times: task.times,
          },
        };
        dispatch(addGoalTask(data));
      });
      setTasksArray([]);
    }
  };
  const handleUpdateGoal = () => {
    if (val && keyName) {
      const data = {
        goalId: params.goalId,
        accessToken: user.accessToken,
        goal: {
          val,
          keyName
        }
      }
      dispatch(updateGoal(data));
      setShow(false);
      setVal('');
  }
}
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
      <Popover.Header as="h3">Are you sure?</Popover.Header>
      <Popover.Body>
        This action is irreversible, it will{' '}
        <strong>remove all your progress for this goal.</strong>
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
        <Form.Control
          onChange={(e) => setVal(e.target.value)}
          autoComplete="name"
          value={val}
          type="text"
          placeholder={`Enter ${keyName}`}
        />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateGoal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ListGroup className="mb-3">
        <ListGroup.Item action as={Button} onClick={(e) => handleShow("name")}>        <div className="ms-2 me-auto">
          <div className="fw-bold">Name:</div>
          {goal.name}
        </div></ListGroup.Item>
<ListGroup.Item action as={Button} onClick={(e) => handleShow("description")}>
<div className="ms-2 me-auto">
          <div className="fw-bold">Description:</div>
          {goal.description}
        </div>
</ListGroup.Item>
</ListGroup>
        <Row className="border-bottom border-secondary">
          <Col>Task name:</Col>
          <Col>Progress:</Col>
        </Row>
        {goalTasks.length > 0 &&
          goalTasks.map((goalTask) => {
            const task = tasks.find((task) => task.id === goalTask.task_id);
            const progress = (goalTask.done / goalTask.times) * 100;
            return (
              <Row key={goalTask.id} className="border-bottom border-secondary">
                <Col>{task.name}</Col>
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
      <AddGoalTask tasksArray={tasksArray} setTasksArray={setTasksArray} />
      <p className="text-danger">{goalsData.message}</p>
      <Button variant="success" onClick={handleClick}>
        Submit Tasks
      </Button>
      <Row>
        <Col>
          <Button
            variant="warning"
            as={Link}
            to={`../../tasks/add/${params.goalId}`}
          >
            Add New Task
          </Button>
        </Col>
        <Col>
          {' '}
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Button variant="success">Delete Goal</Button>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
        }
