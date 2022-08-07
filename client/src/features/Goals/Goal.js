import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../users/userSlice';
import { getGoalTasks, selectGoals } from './goalsSlice';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import './goals.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { selectTasks } from '../tasks/tasksSlice';
export default function Goal() {
  const params = useParams();
  const goalsData = useSelector(selectGoals);
  const { tasks } = useSelector(selectTasks);
  const { goals, goalTasks } = goalsData;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const goal = goals.find((goal) => goal.id === Number(params.goalId));
  useEffect(() => {
    const data = {
      userId: user.user.id,
      goalId: params.goalId,
      accessToken: user.accessToken,
    };
    dispatch(getGoalTasks(data));
  }, [params.goalId]);
  return (
    <Container>
      <Button variant="primary" as={Link} to={`../tasks/add/${params.goalId}`}>
        Add New Task
      </Button>
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
  );
}
