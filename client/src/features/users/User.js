import { useDispatch } from 'react-redux';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

export default function User() {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch({ type: 'USER_LOGOUT' });
  };
  return (
    <NavDropdown title="User" id="collapsible-nav-dropdown">
      <NavDropdown.Item as={Link} href="#" to="/user">
        Settings
      </NavDropdown.Item>
      <NavDropdown.Item onClick={handleClick} href="/">
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
}
