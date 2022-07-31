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
      <h2>User Information</h2>
      <h4>First Name: {user.user.firstname}</h4>
      <h4>Last Name: {user.user.lastname}</h4>
      <h4>Email: {user.user.email}</h4>
      <h3>Update your information:</h3>
      <UserForm />
      <Button variant="secondary" as={Link} to="password">
        Change password
      </Button>
    </div>
  );
}
