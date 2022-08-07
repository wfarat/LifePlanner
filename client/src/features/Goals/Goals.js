import { useSelector } from 'react-redux';
import { selectGoals } from './goalsSlice';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './goals.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export default function Goals() {
  const goalsData = useSelector(selectGoals);
  const { goals } = goalsData;
  return (
    <Container>
      <Button variant="primary" as={Link} to="add">
        Add Goal
      </Button>
      <Row>
        <Col>Goal name:</Col>
        <Col>Created:</Col>
        <Col>Edited:</Col>
      </Row>
      {goals.length > 0 &&
        goals.map((goal) => {
          const created = new Date(goal.created).toLocaleString();
          const edited = new Date(goal.created).toLocaleString();
          return (
            <Row as={Link} className="goalLink" key={goal.id} to={`${goal.id}`}>
              <Col>{goal.name}</Col>
              <Col>{created}</Col>
              <Col>{edited}</Col>
            </Row>
          );
        })}
    </Container>
  );
}
