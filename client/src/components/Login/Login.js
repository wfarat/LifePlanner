import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import GoogleButton from 'react-google-button';
import { Navigate, Link } from 'react-router-dom';
import { selectUser, login, loginGoogle } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import Form from 'react-bootstrap/Form';
import './login.css';
import LangaugeSwitch from '../LanguageSwitch/LanguageSwitch';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const intl = useIntl();
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
  useEffect(() => {
    dispatch({ type: 'USER_LOGOUT' });
  }, []);
  const handleClick = () => {
    if (!email) {
      setMessage(intl.formatMessage({ id: 'message.email' }));
    } else if (!password) {
      setMessage(intl.formatMessage({ id: 'message.password' }));
    } else {
      setMessage('');
      const data = {
        email,
        password,
      };
      dispatch(login(data));
    }
  };
  const testLogin = () => {
    const data = {
      email: 'test@gmail.com',
      password: 'password',
    };
    dispatch(login(data));
  };
  return (
    <>
      <main className="login">
        <div className="switch">
          {' '}
          <LangaugeSwitch />{' '}
        </div>
        {user.auth && <Navigate to="../" />}
        <h2>
          <FormattedMessage id="login.header" />
        </h2>
        <Form className="signForm">
          <Form.Text className="text-dark fs-5">
            <FormattedMessage id="login.notregistered" />
            <Button variant="success" as={Link} to="/register">
              <FormattedMessage id="button.signup" />
            </Button>
          </Form.Text>
          <Form.Group className="m-3" controlId="formBasicEmail">
            <Form.Label>
              <FormattedMessage id="user.email" />
            </Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              value={email}
              type="email"
              placeholder={intl.formatMessage({ id: 'user.emailplaceholder' })}
            />
          </Form.Group>

          <Form.Group className="m-3" controlId="formBasicPassword">
            <Form.Label>
              <FormattedMessage id="user.password" />
            </Form.Label>
            <Form.Control
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              value={password}
              type="password"
              placeholder={intl.formatMessage({
                id: 'user.passwordplaceholder',
              })}
            />
            <Form.Text className="text-danger">
              {message}
              {user.message}
            </Form.Text>
          </Form.Group>
          <div className="loginButton">
            <Button variant="success" onClick={handleClick}>
              <FormattedMessage id="button.submit" />
            </Button>
            <GoogleButton
              label={intl.formatMessage({ id: 'button.google' })}
              type="light"
              onClick={googleLogin}
            >
              <FormattedMessage id="button.google" />
            </GoogleButton>
            <Button onClick={testLogin}>
              <FormattedMessage id="button.testlogin" />
            </Button>
          </div>
        </Form>
      </main>
    </>
  );
}
