import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FormattedMessage } from 'react-intl';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { selectTasks } from './tasksSlice';
export default function Tasks() {
  const tasksData = useSelector(selectTasks);
  const { tasks } = tasksData;

  return (
    <Container>
      <Button variant="success" className="m-3" as={Link} to="add">
        <FormattedMessage id="button.addtask" />
      </Button>
      <Row>
        <Col>
          <h3>
            <FormattedMessage id="tasks.header" />
          </h3>
        </Col>
      </Row>
      <ListGroup>
        {tasks.length > 0 &&
          tasks.map((task) => {
            return (
              <ListGroup.Item action as={Link} to={`${task.id}`} key={task.id}>
                {task.name}
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </Container>
  );
}
