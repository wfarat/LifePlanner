import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Outlet, Link } from 'react-router-dom';
import { selectUser } from '../users/userSlice';
import { createDay, findDay, selectDay } from './daySlice';
import Button from 'react-bootstrap/Button';

export default function Day(props) {
  const dayData = useSelector(selectDay);
  const { day } = dayData;
  const dispatch = useDispatch();
  const params = useParams();
  const [comment, setComment] = useState('');
  const user = useSelector(selectUser);
  const getDateCompiled = () => {
    let dateYear, dateMonth, dateDay;
    if (params.dayRef) {
     dateYear = params.dayRef.slice(0,4);
     dateMonth = params.dayRef.slice(4,6);
     dateDay = params.dayRef.slice(6,8);
    } else {
       dateYear = props.today.slice(0,4);
       dateMonth = props.today.slice(4,6);
       dateDay = props.today.slice(6,8);
    }
const      dateCompiled = new Date(`${dateYear}-${dateMonth}-${dateDay}`);
return dateCompiled;
  }
  const nextDay = () => {
    let nextDay = new Date(getDateCompiled());
    nextDay.setDate(getDateCompiled().getDate()+1);
    let day = nextDay.getDate();
    if (day < 10) { 
      day = '0' + day;
    }
    let month = nextDay.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    const year = nextDay.getFullYear();
    const dateString = `${year}${month}${day}`;
    return dateString;
  }
  const previousDay = () => {
    let prevDate = new Date(getDateCompiled());
    prevDate.setDate(getDateCompiled().getDate()-1);
    let day = prevDate.getDate();
    if (day < 10) { 
      day = '0' + day;
    }
    let month = prevDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    const year = prevDate.getFullYear();
    const dateString = `${year}${month}${day}`;
    return dateString;
  }
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
                <Button as={Link} to={`/day/${previousDay()}`} className="m-3">Previous Day</Button> <Button as={Link} to={`/day/${nextDay()}`} className="m-3">Next Day</Button> 
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
