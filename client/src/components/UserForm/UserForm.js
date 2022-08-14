import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import { registerUser } from '../../features/users/userSlice';
import { update } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FormattedMessage, useIntl } from 'react-intl';

export default function UserForm() {
  const user = useSelector(selectUser);
  const [email, setEmail] = useState('');
  const intl = useIntl();
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
      <Form.Group className="mb-2" controlId="formBasicEmail">
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
      <Form.Group className="mb-2" controlId="formFirstname">
        <Form.Label>
          <FormattedMessage id="user.firstname" />
        </Form.Label>
        <Form.Control
          onChange={(e) => setFirstname(e.target.value)}
          value={firstname}
          type="text"
          placeholder={intl.formatMessage({ id: 'user.firstnameplaceholder' })}
        />
      </Form.Group>
      <Form.Group className="mb-2" controlId="formLastname">
        <Form.Label>
          <FormattedMessage id="user.lastname" />
        </Form.Label>
        <Form.Control
          onChange={(e) => setLastname(e.target.value)}
          value={lastname}
          type="text"
          placeholder={intl.formatMessage({ id: 'user.lastnameplaceholder' })}
        />
      </Form.Group>
      <Form.Group className="mb-2" controlId="formBasicPassword">
        <Form.Label>
          <FormattedMessage id="user.password" />
        </Form.Label>
        <Form.Control
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          value={password}
          type="password"
          placeholder={intl.formatMessage({ id: 'user.passwordplaceholder' })}
        />
        {user.auth && (
          <Form.Text className="text-danger">{user.message}</Form.Text>
        )}
      </Form.Group>
      {!user.auth && (
        <Form.Group className="mb-2" controlId="formRepeatPassword">
          <Form.Label>
            <FormattedMessage id="user.repeatpassword" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setRepeat(e.target.value)}
            autoComplete="new-password"
            value={repeat}
            type="password"
            placeholder={intl.formatMessage({ id: 'user.passwordplaceholder' })}
          />
          <Form.Text className="text-danger">
            {!same && (
              <Form.Text className="text-danger">
                <FormattedMessage id="user.notmatch" />
              </Form.Text>
            )}
            {userName && `Welcome ${userName}, your account has been created.`}
          </Form.Text>
        </Form.Group>
      )}
      <Button variant="success" onClick={handleClick}>
        <FormattedMessage id="button.submit" />
      </Button>
    </Form>
  );
}
