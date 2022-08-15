import { useDispatch, useSelector } from 'react-redux';
import { getGoals, selectGoals } from './goalsSlice';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FormattedMessage } from 'react-intl';
import { selectUser } from '../users/userSlice';
import { useEffect } from 'react';
export default function Goals() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const goalsData = useSelector(selectGoals);
  const { goals } = goalsData;
  useEffect(() => {
    const data = {
      accessToken: user.accessToken,
    };
    dispatch(getGoals(data));
  }, []);
  return (
    <Container>
      <Button variant="success" as={Link} to="add">
        <FormattedMessage id="button.addgoal" />
      </Button>
      <Row className="border-bottom border-secondary">
        <Col>
          <FormattedMessage id="goals.name" />
        </Col>
        a
        <Col>
          <FormattedMessage id="goals.progress" />
        </Col>
      </Row>
      {goals.length > 0 &&
        goals.map((goal) => {
          const progress = (goal.done / goal.times) * 100;
          return (
            <Row
              as={Link}
              className="listLink border-bottom border-secondary"
              key={goal.id}
              to={`${goal.id}`}
            >
              <Col>{goal.name}</Col>
              <Col>
                {goal.times > 0 && (
                  <ProgressBar
                    style={{ margin: '3px' }}
                    animated
                    variant={progress === 100 ? 'success' : 'warning'}
                    now={progress}
                    label={`${progress}%`}
                  />
                )}
              </Col>
            </Row>
          );
        })}
    </Container>
  );
}
