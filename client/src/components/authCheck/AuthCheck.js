import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import { Navigate } from 'react-router-dom';

export default function AuthCheck({ children }) {
  const user = useSelector(selectUser);
  return user.auth ? children : <Navigate to="/login" />;
}
