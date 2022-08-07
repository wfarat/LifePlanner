import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import { Navigate, Link } from 'react-router-dom';
import UserForm from '../UserForm/UserForm';
import Button from 'react-bootstrap/esm/Button';
export default function UserPage() {
  const user = useSelector(selectUser);
  if (!user.auth) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="user-container">
      <h3>User Information</h3>
      <h5>First Name: {user.user.firstname}</h5>
      <h5>Last Name: {user.user.lastname}</h5>
      <h5>Email: {user.user.email}</h5>
      <h4>Update your information:</h4>
      <UserForm />
      <Button variant="success" className="mt-3" as={Link} to="password">
        Change password
      </Button>
    </div>
  );
}
