import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import User from './features/users/User';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getTasks, selectTasks } from './features/tasks/tasksSlice';
import { HouseDoorFill } from 'react-bootstrap-icons';
import { selectUser } from './features/users/userSlice';
import { getGoals, selectGoals } from './features/Goals/goalsSlice';
import LangaugeSwitch from './components/LanguageSwitch/LanguageSwitch';

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
          bg="light"
          variant="light"
          fixed="top"
        >
          <Container>
            <Navbar.Brand as={Link} to="/" href="#">
              <HouseDoorFill size={30} />
            </Navbar.Brand>
            <Button variant="primary" onClick={() => navigate(-1)}>
              <FormattedMessage id="nav.back" />
            </Button>
            <LangaugeSwitch />
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="calendar" href="#">
                  <FormattedMessage id="nav.calendar" />
                </Nav.Link>
                <Nav.Link as={Link} to="tasks" href="#">
                  <FormattedMessage id="nav.tasks" />
                </Nav.Link>
                <Nav.Link as={Link} to="goals" href="#">
                  <FormattedMessage id="nav.goals" />
                </Nav.Link>
                <Nav.Link as={Link} to="user/notes" href="#">
                  <FormattedMessage id="nav.notes" />
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
      <footer className="fixed-bottom bg-light text-dark">
        <FormattedMessage id="contact.me" /> Władysław Farat{' '}
        <a className="link-primary" href="https://github.com/wfarat">
          Github
        </a>{' '}
        <a className="link-primary" href="mailto:wfarat@gmail.com">
          E-mail
        </a>{' '}
      </footer>
    </div>
  );
}

export default App;
