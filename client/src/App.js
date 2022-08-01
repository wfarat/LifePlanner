import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import User from './features/users/User';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          fixed="top"
        >
          <Container>
            <Navbar.Brand as={Link} to="/" href="#">
              Life Planner
            </Navbar.Brand>
            <Button variant="primary" onClick={() => navigate(-1)}>
              Go back
            </Button>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="calendar" href="#">
                  Calendar
                </Nav.Link>
                <User />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
