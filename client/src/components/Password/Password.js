import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormattedMessage, useIntl } from 'react-intl';
export const updatePassword = async (data, userId) => {
  const res = await axios(`/api/users/${userId}/password`, {
    method: 'PUT',
    headers: { 'x-access-token': data.accessToken },
    data: data.info,
  }).catch((err) => err.response);
  return res.data.message;
};

export default function Password() {
  const user = useSelector(selectUser);
  const [oldPassword, setOldPassword] = useState('');
  const intl = useIntl();
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
      <h2>
        <FormattedMessage id="user.changepassword" />
      </h2>
      <Form className="signForm">
        <Form.Group className="mb-2" controlId="formBasicPassword">
          <Form.Label>
            <FormattedMessage id="user.password" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete="new-password"
            value={oldPassword}
            type="password"
            placeholder={intl.formatMessage({ id: 'user.passwordplaceholder' })}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formLastname">
          <Form.Label>
            <FormattedMessage id="user.newpassword" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="current-password"
            value={newPassword}
            type="password"
            placeholder={intl.formatMessage({
              id: 'user.newpasswordplaceholder',
            })}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formRepeatPassword">
          <Form.Label>
            <FormattedMessage id="user.repeatpassword" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setRepeat(e.target.value)}
            autoComplete="new-password"
            value={repeat}
            type="password"
            placeholder={intl.formatMessage({ id: 'user.repeatplaceholder' })}
          />
          <Form.Text className="text-danger">
            <Form.Text className="text-danger">{message}</Form.Text>
            {!same && (
              <Form.Text className="text-danger">
                <FormattedMessage id="user.notmatch" />
              </Form.Text>
            )}
          </Form.Text>
        </Form.Group>
        <Button variant="success" onClick={handleClick}>
          <FormattedMessage id="button.submit" />
        </Button>
      </Form>
    </div>
  );
}
