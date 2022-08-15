import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { selectUser } from '../users/userSlice';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminUsers, selectAdmin } from './adminSlice';
export default function Admin() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const adminData = useSelector(selectAdmin);
  const { adminUsers } = adminData;
  useEffect(() => {
    const data = {
      accessToken: user.accessToken,
    };
    dispatch(getAdminUsers(data));
  }, []);
  return (
    <Container>
        {adminData.redirect && <Navigate to="/" />}
        {adminData.adminUsers &&
        <ListGroup>
        {adminUsers.length > 0 && adminUsers.map(user => {
                        return ( <ListGroup.Item action as={Link} to={`${user.id}`} key={user.id}>
                         {user.email}
                       </ListGroup.Item>  )
        })}
        </ListGroup>
}
    </Container>
  );
}
