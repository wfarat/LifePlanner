import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectUser, check } from './userSlice';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
export default function User() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const handleClick = () => {
    dispatch({ type: 'USER_LOGOUT' });
  };
 useEffect(() => {
    const data = {
      accessToken: user.accessToken,
      userId: user.user.id,
    }
    dispatch(check(data));
    if (user.logout) {
      dispatch({ type: 'USER_LOGOUT' });
    }
  }, [])
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
