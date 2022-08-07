import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { selectTasks } from './tasksSlice';
export default function Tasks() {
  const tasksData = useSelector(selectTasks);
  const { tasks } = tasksData;
  const dayLetters = ['M', 'Tue', 'W', 'Thu', 'F', 'Sat', 'Sun'];
  return (
    <Container>
      <Button variant="success" as={Link} to="add">
        Add Task
      </Button>
      <Row className="border-bottom border-secondary">
        <Col>Task name:</Col>
        <Col>Repeat:</Col>
        <Col>Duration:</Col>
      </Row>
      {tasks.length > 0 &&
        tasks.map((task) => {
          return (
            <Row
              as={Link}
              className="listLink border-bottom border-secondary"
              key={task.id}
              to={`${task.id}`}
            >
              <Col>{task.name}</Col>
              <Col>{task.repeat.map((num) => dayLetters[num])}</Col>
              <Col>{task.duration}</Col>
            </Row>
          );
        })}
    </Container>
  );
}
