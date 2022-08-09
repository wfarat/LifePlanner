import React from 'react';
import UserForm from '../UserForm/UserForm';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';
export default function Register() {
  return (
    <div className="login">
      <h2>Create an account:</h2>
      <Form.Text className="text-secondary fs-5">
        Already have an account?{' '}
        <Button variant="success" as={Link} to="/login">
          Sign in
        </Button>
      </Form.Text>
      <UserForm />
    </div>
  );
}
