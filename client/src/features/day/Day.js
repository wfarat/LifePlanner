import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import { Outlet, Link } from 'react-router-dom';
import { selectUser } from '../users/userSlice';
import { findDay, selectDay, updateDay, selectStatus } from './daySlice';
import Button from 'react-bootstrap/Button';
import useRandomQuote from '../../hooks/useRandomQuote';
import { FormattedMessage, useIntl, FormattedDate } from 'react-intl';

export default function Day(props) {
  const dayData = useSelector(selectDay);
  const { day } = dayData;
  const dispatch = useDispatch();
  const params = useParams();
  const status = useSelector(selectStatus);
  const intl = useIntl();
  const [comment, setComment] = useState('');
  const user = useSelector(selectUser);
  const [show, setShow] = useState(false);
  const randomQuote = useRandomQuote();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getDateCompiled = () => {
    let dateYear, dateMonth, dateDay;
    if (params.dayRef) {
      dateYear = params.dayRef.slice(0, 4);
      dateMonth = params.dayRef.slice(4, 6);
      dateDay = params.dayRef.slice(6, 8);
    } else {
      dateYear = props.today.slice(0, 4);
      dateMonth = props.today.slice(4, 6);
      dateDay = props.today.slice(6, 8);
    }
    const dateCompiled = new Date(`${dateYear}-${dateMonth}-${dateDay}`);
    return dateCompiled;
  };
  const nextDay = () => {
    let nextDay = new Date(getDateCompiled());
    nextDay.setDate(getDateCompiled().getDate() + 1);
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
  };
  const previousDay = () => {
    let prevDate = new Date(getDateCompiled());
    prevDate.setDate(getDateCompiled().getDate() - 1);
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
  };
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
  const handleUpdateDay = () => {
    if (props.today) {
      const data = {
        accessToken: user.accessToken,
        day: {
          dayRef: props.today,
          comment,
        },
      };
      dispatch(updateDay(data));
    } else {
      const data = {
        accessToken: user.accessToken,
        day: {
          dayRef: params.dayRef,
          comment,
        },
      };
      dispatch(updateDay(data));
    }
  };
  return (
    <div>
      {status === 'pending' && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {(status === 'idle' || status === 'rejected') && (
        <Container>
          <Row>
            <Col xs="3">
              {' '}
              <Button as={Link} to={`/day/${previousDay()}`} variant="light">
                <ArrowLeft size={25} />
              </Button>
            </Col>
            <Col xs="6">
              {' '}
              <FormattedDate
                value={getDateCompiled()}
                year="numeric"
                month="long"
                day="numeric"
                weekday="long"
              />
            </Col>
            <Col xs="3">
              {' '}
              <Button as={Link} to={`/day/${nextDay()}`} variant="light">
                <ArrowRight size={25} />
              </Button>{' '}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button as={Link} to="/one" className="mb-2" variant="warning">
                <FormattedMessage id="button.addone" />
              </Button>
            </Col>
          </Row>
          {day.id && (
            <Container>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title className="text-dark">
                    <FormattedMessage id="day.comment" />
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {' '}
                  <Form.Control
                    onChange={(e) => setComment(e.target.value)}
                    autoComplete="name"
                    value={comment}
                    type="text"
                    placeholder={intl.formatMessage({
                      id: 'day.commentplaceholder',
                    })}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    <FormattedMessage id="button.close" />
                  </Button>
                  <Button variant="primary" onClick={handleUpdateDay}>
                    <FormattedMessage id="button.savechanges" />
                  </Button>
                </Modal.Footer>
              </Modal>
              <ListGroup className="mb-3">
                <ListGroup.Item action as={Button} onClick={handleShow}>
                  {day.comment}
                  {!day.comment && randomQuote}
                </ListGroup.Item>
              </ListGroup>
              <Outlet />{' '}
            </Container>
          )}
        </Container>
      )}
    </div>
  );
}
