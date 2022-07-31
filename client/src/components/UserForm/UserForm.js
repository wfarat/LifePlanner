import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import { registerUser } from '../../features/users/userSlice';
import { update } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function UserForm() {
  const user = useSelector(selectUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [same, setSame] = useState(true);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const handleClick = async () => {
    const data = {
      email,
      firstname,
      lastname,
      password,
    };
    if (!user.auth) {
      if (password !== repeat) {
        setSame(false);
      } else {
        setSame(true);
        let name;

        name = await registerUser(data);
        setUserName(name);
      }
    } else {
      dispatch(
        update({
          accessToken: user.accessToken,
          userId: user.user.id,
          info: data,
        })
      );
    }
  };
  return (
    <Form className="signForm">
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
      <Form.Group className="mb-3" controlId="formFirstname">
        <Form.Label>First name</Form.Label>
        <Form.Control
          onChange={(e) => setFirstname(e.target.value)}
          value={firstname}
          type="text"
          placeholder="Enter first name"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formLastname">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          onChange={(e) => setLastname(e.target.value)}
          value={lastname}
          type="text"
          placeholder="Enter last name"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          value={password}
          type="password"
          placeholder="Password"
        />
        {user.auth && (
          <Form.Text className="text-danger">{user.message}</Form.Text>
        )}
      </Form.Group>
      {!user.auth && (
        <Form.Group className="mb-3" controlId="formRepeatPassword">
          <Form.Label>Repeat password</Form.Label>
          <Form.Control
            onChange={(e) => setRepeat(e.target.value)}
            autoComplete="new-password"
            value={repeat}
            type="password"
            placeholder="Password"
          />
          <Form.Text className="text-danger">
            {!same && (
              <Form.Text className="text-danger">
                Password don't match
              </Form.Text>
            )}
            {userName && `Welcome ${userName}, your account has been created.`}
          </Form.Text>
        </Form.Group>
      )}
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>
    </Form>
  );
}
