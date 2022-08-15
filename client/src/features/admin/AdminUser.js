import { useParams } from 'react-router-dom';
import { selectAdmin } from './adminSlice';
import { useSelector } from 'react-redux';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Container from 'react-bootstrap/esm/Container';
export default function AdminUser() {
  const { adminUsers } = useSelector(selectAdmin);
  const params = useParams();
  const user = adminUsers.find((user) => user.id === Number(params.userId));
  return (
    <Container>
      {user && (
        <ListGroup>
          <ListGroup.Item>{user.id}</ListGroup.Item>
          <ListGroup.Item>{user.email}</ListGroup.Item>
          <ListGroup.Item>{user.firstname}</ListGroup.Item>
          <ListGroup.Item>{user.lastname}</ListGroup.Item>
        </ListGroup>
      )}
    </Container>
  );
}
