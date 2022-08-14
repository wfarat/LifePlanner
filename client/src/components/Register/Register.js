import React from 'react';
import UserForm from '../UserForm/UserForm';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
export default function Register() {
  return (
    <div className="login">
      <h2>
        <FormattedMessage id="register.header" />
      </h2>
      <Form.Text className="text-dark fs-5">
        <FormattedMessage id="register.message" />
        <Button variant="success" as={Link} to="/login">
          <FormattedMessage id="button.signin" />
        </Button>
      </Form.Text>
      <UserForm />
    </div>
  );
}
