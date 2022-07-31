import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
export const updatePassword = async (data, userId) => {
  const res = await axios(
    `http://localhost:3000/api/users/${userId}/password`,
    {
      method: 'PUT',
      headers: { 'x-access-token': data.accessToken },
      data: data.info,
    }
  ).catch((err) => err.response);
  return res.data.message;
};

export default function Password() {
  const user = useSelector(selectUser);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [same, setSame] = useState(true);
  const [message, setMessage] = useState('');
  if (!user.auth) {
    return <Navigate to="/login" />;
  }
  const handleClick = async () => {
    if (newPassword !== repeat) {
      setSame(false);
    } else {
      setSame(true);
      const data = {
        info: {
          oldPassword,
          newPassword,
        },
        accessToken: user.accessToken,
      };
      const newMessage = await updatePassword(data, user.user.id);
      setMessage(newMessage);
    }
  };
  return (
    <div className="password-change">
      <h2>Change your password:</h2>
      <Form className="signForm">
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete="new-password"
            value={oldPassword}
            type="password"
            placeholder="Old Password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formLastname">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="current-password"
            value={newPassword}
            type="password"
            placeholder="New Password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formRepeatPassword">
          <Form.Label>Repeat password</Form.Label>
          <Form.Control
            onChange={(e) => setRepeat(e.target.value)}
            autoComplete="new-password"
            value={repeat}
            type="password"
            placeholder="Old Password"
          />
          <Form.Text className="text-danger">
            <Form.Text className="text-danger">{message}</Form.Text>
            {!same && (
              <Form.Text className="text-danger">
                Password don't match
              </Form.Text>
            )}
          </Form.Text>
        </Form.Group>
        <Button variant="primary" onClick={handleClick}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
