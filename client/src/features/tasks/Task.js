import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../users/userSlice';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { selectTasks, deleteTask } from '../tasks/tasksSlice';

export default function Task() {
  const params = useParams();
  const { tasks } = useSelector(selectTasks);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const task = tasks.find((task) => task.id === Number(params.taskId));
  const handleDelete = () => {
    const data = {
      taskId: params.taskId,
      accessToken: user.accessToken,
    };
    dispatch(deleteTask(data));
    navigate('../tasks');
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Are you sure?</Popover.Header>
      <Popover.Body>
        This action is irreversible, it will{' '}
        <strong>remove all your progress and plans for this task.</strong>
        If you are sure click: <Button onClick={handleDelete}>Delete</Button>
      </Popover.Body>
    </Popover>
  );
  return (
    <Container>
        <Row>
          <Col>
            <h2>{task.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col><p>{task.description}</p></Col>
        </Row>
      <Row>
        <Col>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
            <Button variant="success">Delete Task</Button>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}
