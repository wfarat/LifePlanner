import { useDispatch, useSelector } from 'react-redux';
import { getGoals, selectGoals } from './goalsSlice';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { selectUser } from '../users/userSlice';
import { useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
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
      <Row>
        <Col>
          <FormattedMessage id="goals.name" />
        </Col>
        <Col>
          <FormattedMessage id="tasks.start" />
        </Col>
        <Col>
          <FormattedMessage id="tasks.finish" />
        </Col>
      </Row>
      <ListGroup>
        {goals.length > 0 &&
          goals.map((goal) => {
            const progress = Math.round((goal.done / goal.times) * 1000) / 10;
            return (
              <ListGroup.Item action as={Link} key={goal.id} to={`${goal.id}`}>
                <Row>
                  <Col>{goal.name}</Col>
                  <Col>
                    {' '}
                    {goal.start && (
                      <FormattedDate
                        value={goal.start}
                        year="numeric"
                        month="long"
                        day="numeric"
                      />
                    )}
                  </Col>
                  <Col>
                    {goal.finish && (
                      <FormattedDate
                        value={goal.finish}
                        year="numeric"
                        month="long"
                        day="numeric"
                      />
                    )}
                  </Col>
                </Row>
                <Row>
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
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </Container>
  );
}
