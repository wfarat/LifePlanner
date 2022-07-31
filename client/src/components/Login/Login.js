import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';
import { selectUser, login, loginGoogle } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const tokens = await axios.post('/api/auth/google', {
        code,
      });

      dispatch(loginGoogle(tokens.data));
    },
    flow: 'auth-code',
  });
  if (user.auth === true) {
    return <Navigate to="/" />;
  }
  const handleClick = () => {
    if (!email) {
      setMessage('Please enter correct email.');
    } else if (!password) {
      setMessage('Please enter password.');
    } else {
      setMessage('');
      const data = {
        email,
        password,
      };
      dispatch(login(data));
    }
  };

  return (
    <Form className="signForm">
      <Form.Text className="text-secondary">
        Not registered yet? <Link to="../register">Sign up</Link>
      </Form.Text>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          value={email}
          type="email"
          placeholder="Enter email"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          value={password}
          type="password"
          placeholder="Password"
        />
        <Form.Text className="text-danger">
          {message}
          {user.message}
        </Form.Text>
      </Form.Group>
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
      <Button onClick={googleLogin} variant="secondary">
        Login with Google
      </Button>
    </Form>
  );
}
