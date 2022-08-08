import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../users/userSlice';
import {
  addGoalTask,
  deleteGoal,
  getGoalTasks,
  selectGoals,
} from './goalsSlice';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { selectTasks } from '../tasks/tasksSlice';
import AddGoalTask from '../../components/AddGoalTask/AddGoalTask';
export default function Goal() {
  const params = useParams();
  const goalsData = useSelector(selectGoals);
  const { tasks } = useSelector(selectTasks);
  const [tasksArray, setTasksArray] = useState([]);
  const { goals, goalTasks } = goalsData;
  const user = useSelector(selectUser);
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
      <Container>
        <Row>
          <Col>
            <h2>{goal.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col>Task name:</Col>
          <Col>Goal:</Col>
          <Col>Times finished:</Col>
        </Row>
        {goalTasks.length > 0 &&
          goalTasks.map((goalTask) => {
            const task = tasks.find((task) => task.id === goalTask.task_id);
            return (
              <Row key={goalTask.id}>
                <Col>{task.name}</Col>
                <Col>{goalTask.times}</Col>
                <Col>{goalTask.done}</Col>
              </Row>
            );
          })}
      </Container>
      <AddGoalTask tasksArray={tasksArray} setTasksArray={setTasksArray} />
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
