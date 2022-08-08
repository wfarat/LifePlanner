import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import AddDay from '../../components/AddDay/AddDay';
import Popover from 'react-bootstrap/esm/Popover';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Button from 'react-bootstrap/esm/Button';
import { selectUser } from '../users/userSlice';
import { getDay, selectDay } from './daySlice';
import { selectTasks } from '../tasks/tasksSlice';

export default function Day() {
  const dayData = useSelector(selectDay);
  const { day, dayTasks, dayNotes} = dayData; 
  const dispatch = useDispatch();
  const { tasks } = useSelector(selectTasks);
  const user = useSelector(selectUser);
  const params = useParams();
  useEffect(() => {
    const data = {
      dayRef: params.dayRef,
      accessToken: user.accessToken,
    };
    dispatch(getDay(data));
  }, [params.dayRef]);
  const handleClick = () => {

  }
  const handleNote = () => {

  }
  return (
    <div>
          {day &&
      <Container>
        <Row>
          <Col><p className="fs-5"> {day.comment} </p></Col>
        </Row>
        <Row>
          <Col>
          Task Name:
          </Col>
          <Col>
          Start
          </Col>
          <Col>
          Finish
          </Col>
        </Row>
        <ListGroup>
        {dayTasks.length > 0 &&
          dayTasks.map((task) => {
            let startHours, startMinutes, finishHours, finishMinutes;
            if (task.start > 0) {
              startHours =
                Math.floor(task.start / 60) < 10
                  ? '0' + Math.floor(task.start / 60)
                  : Math.floor(task.start / 60);
              startMinutes =
                task.start % 60 < 10
                  ? '0' + (task.start % 60)
                  : task.start % 60;
              finishHours =
                Math.floor(task.finish / 60) < 10
                  ? '0' + Math.floor(task.finish / 60)
                  : Math.floor(task.finish / 60);
              finishMinutes =
                task.finish % 60 < 10
                  ? '0' + (task.finish % 60)
                  : task.finish % 60;
            }
            const findTask = tasks.find(t => t.id === task.task_id);
            return (
              <ListGroup.Item
                action
                onClick={() => {
                  handleClick(task);
                }}
                key={task.id + task.start}
              >
                <Row>
                  <Col>
                {findTask.name}{' '}</Col>
                
                 <Col> { task.start > 0 && startHours +
                    ':' +
                    startMinutes} {''} </Col>
                  <Col> { task.finish > 0 &&
                    finishHours +
                    ':' +
                    finishMinutes } {''}</Col> 
                    </Row>
              </ListGroup.Item>
            );
          })}
      </ListGroup>
      <Row>
        <Col>
        <p className="fs-5">Notes:</p>
        </Col>
      </Row>
      <ListGroup>
        {dayNotes.length > 0 &&
          dayNotes.map((note) => {
            const popover = (
              <Popover id="popover-basic">
                <Popover.Header as="h3">{note.title}</Popover.Header>
                <Popover.Body>{note.content}</Popover.Body>
              </Popover>
            );
            return (
              <Container>
                <Row>
                  <Col>
                    <ListGroup.Item
                      action
                      onClick={() => {
                        handleNote(note.id);
                      }}
                      key={note.id}
                    >
                      {!note.title && 'Untitled note'} {note.title}
                    </ListGroup.Item>
                  </Col>
                  <Col>
                    <OverlayTrigger
                      trigger="click"
                      placement="bottom"
                      overlay={popover}
                    >
                      <Button variant="success">Read Note</Button>
                    </OverlayTrigger>
                  </Col>
                </Row>
              </Container>
            );
          })}
      </ListGroup>
      </Container> }
      {!day && <AddDay dayRef={params.dayRef} />}
    </div>
  );
}
