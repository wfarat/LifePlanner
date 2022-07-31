import React from 'react';
import UserForm from '../UserForm/UserForm';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
export default function Register() {
  return (
    <div className="register">
      <h2>Create an account:</h2>
      <Form.Text className="text-secondary">
        Already have an account? <Link to="login">Sign in</Link>
      </Form.Text>
      <UserForm />
    </div>
  );
}
