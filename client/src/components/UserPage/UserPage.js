import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import { Navigate, Link } from 'react-router-dom';
import UserForm from '../UserForm/UserForm';
import Button from 'react-bootstrap/esm/Button';
import { FormattedMessage } from 'react-intl';
export default function UserPage() {
  const user = useSelector(selectUser);
  if (!user.auth) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="user-container">
      <h3><FormattedMessage id="user.info" /></h3>
      <h5><FormattedMessage id="user.firstname" />: {user.user.firstname}</h5>
      <h5><FormattedMessage id="user.lastname" />: {user.user.lastname}</h5>
      <h5><FormattedMessage id="user.email" />: {user.user.email}</h5>
      <h4><FormattedMessage id="user.update" /></h4>
      <UserForm />
      <Button variant="warning" className="mt-3" as={Link} to="password">
        <FormattedMessage id="button.changepassword" />
      </Button>
    </div>
  );
}
