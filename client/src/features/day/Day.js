import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Outlet } from 'react-router-dom';
import { selectUser } from '../users/userSlice';
import { createDay, findDay, selectDay } from './daySlice';
import Button from 'react-bootstrap/Button';

export default function Day(props) {
  const dayData = useSelector(selectDay);
  const { day } = dayData;
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const user = useSelector(selectUser);
  const params = useParams();
  useEffect(() => {
    if (props.today) {
      const data = {
        dayRef: props.today,
        accessToken: user.accessToken,
      };
      dispatch(findDay(data));
    } else {
      const data = {
        dayRef: params.dayRef,
        accessToken: user.accessToken,
      };
      dispatch(findDay(data));
    }
  }, [params.dayRef, props.today]);
  const handleClick = () => {
    if (props.today) {
      const data = {
        accessToken: user.accessToken,
        day: {
          dayRef: props.today,
          comment
        }
      };
      dispatch(createDay(data));
    } else {
      const data = {
        accessToken: user.accessToken,
        day: {
          dayRef: params.dayRef,
          comment
        }
      };
      dispatch(createDay(data));
    }
  };
  return (
    <Container>
      {!day.id && (
        <Container>
          <Form className="taskForm">
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="fs-5">
                Add a quote, write a thought, create a theme for this day.
              </Form.Label>
              <Form.Control
                onChange={(e) => setComment(e.target.value)}
                autoComplete="name"
                value={comment}
                type="text"
                placeholder="Enter comment (not required)"
              />
            </Form.Group>
          </Form>
          <Button onClick={handleClick}>Start Planning</Button>
        </Container>
      )}
      {day.id && (
        <Container>
          {' '}
          <Row>
            <Col>
              <p className="fs-5"> {day.comment} </p>
            </Col>
          </Row>       
            <Outlet />{' '}
        </Container>
      )}
    </Container>
  );
}
