import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import User from './features/users/User';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, selectTasks } from './features/tasks/tasksSlice';
import { selectUser } from './features/users/userSlice';
import { getGoals, selectGoals } from './features/Goals/goalsSlice';

function App() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { tasks } = useSelector(selectTasks);
  const { goals } = useSelector(selectGoals);
  const dispatch = useDispatch();
  useEffect(() => {
    const data = {
      accessToken: user.accessToken,
    };
    if (tasks.length === 0 && user.auth) {
      dispatch(getTasks(data));
    }
    if (goals.length === 0 && user.auth) {
      dispatch(getGoals(data));
    }
  }, [user.auth]);
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
                <Nav.Link as={Link} to="tasks" href="#">
                  Tasks
                </Nav.Link>
                <Nav.Link as={Link} to="goals" href="#">
                  Goals
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
