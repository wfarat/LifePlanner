import { useDispatch } from 'react-redux';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
export default function User() {
  const dispatch = useDispatch();
  const intl = useIntl();
  const handleClick = () => {
    dispatch({ type: 'USER_LOGOUT' });
  };
  return (
    <NavDropdown title={intl.formatMessage({id: "nav.user"})} id="collapsible-nav-dropdown">
      <NavDropdown.Item as={Link} href="#" to="/user">
      <FormattedMessage id="nav.settings"/>
      </NavDropdown.Item>
      <NavDropdown.Item onClick={handleClick} href="/">
      <FormattedMessage id="nav.logout"/>
      </NavDropdown.Item>
    </NavDropdown>
  );
}
