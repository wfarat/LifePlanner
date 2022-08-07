import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectUser } from './userSlice';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

export default function User() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const handleClick = () => {
    dispatch({ type: 'USER_LOGOUT' });
  };
  return (
    <NavDropdown title="User" id="collapsible-nav-dropdown">
      <NavDropdown.Item as={Link} href="#" to="/user">
        Settings
      </NavDropdown.Item>
      {!user.auth && (
        <NavDropdown.Item as={Link} href="#" to="/login">
          Login
        </NavDropdown.Item>
      )}
      {!user.auth && (
        <NavDropdown.Item as={Link} href="#" to="/register">
          Register
        </NavDropdown.Item>
      )}
      {user.auth && (
        <NavDropdown.Item onClick={handleClick} href="/">
          Logout
        </NavDropdown.Item>
      )}
    </NavDropdown>
  );
}
