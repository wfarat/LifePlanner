import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
import DatePicker from 'react-datepicker';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';
import { FormattedMessage } from 'react-intl';
import { getAllTasksStats, getStatsByDayRef, selectTasks } from './tasksSlice';
import { useEffect, useState } from 'react';
import { selectUser } from '../users/userSlice';
export default function Stats() {
  const { tasks, allStats } = useSelector(selectTasks);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const getDateString = (value) => {
    let day = value.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    let month = value.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    const year = value.getFullYear();
    const dateString = `${year}${month}${day}`;
    return Number(dateString);
  };
  const handleClick = () => {
    const data = {
      accessToken: user.accessToken,
      days: {
        start: getDateString(startDate),
        end: getDateString(endDate),
      },
    };
    dispatch(getStatsByDayRef(data));
  };
  useEffect(() => {
    const data = {
      accessToken: user.accessToken,
    };
    dispatch(getAllTasksStats(data));
  }, []);
  return (
    <Container>
      <Row>
        <Col>
          <h3>
            <FormattedMessage id="stats.header" />
          </h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormattedMessage id="stats.dates" />
        </Col>
        <Col>
          {' '}
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            withPortal
          />
        </Col>
        <Col>
          <Button onClick={handleClick} variant="success">
            <FormattedMessage id="button.submit" />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <FormattedMessage id="tasks.name" />
        </Col>
        <Col xs={8}>
          <FormattedMessage id="tasks.stats" />
        </Col>
      </Row>
      {tasks.length > 0 &&
        allStats.total.length > 0 &&
        tasks.map((task) => {
          const nostatus = allStats.nostatus.find(
            (stat) => stat.task_id === task.id
          );
          const success = allStats.success.find(
            (stat) => stat.task_id === task.id
          );
          const warning = allStats.warning.find(
            (stat) => stat.task_id === task.id
          );
          const danger = allStats.danger.find(
            (stat) => stat.task_id === task.id
          );
          const total = allStats.total.find((stat) => stat.task_id === task.id);
          return (
            <Row key={task.id}>
              <Col xs={4}>{task.name}</Col>
              <Col xs={8}>
                {total && (
                  <ProgressBar>
                    {success && (
                      <ProgressBar
                        striped
                        variant="success"
                        now={(success.count / total.count) * 100}
                        label={success.count}
                        key={1}
                      />
                    )}
                    {warning && (
                      <ProgressBar
                        variant="warning"
                        now={(warning.count / total.count) * 100}
                        label={warning.count}
                        key={2}
                      />
                    )}
                    {danger && (
                      <ProgressBar
                        striped
                        variant="danger"
                        now={(danger.count / total.count) * 100}
                        label={danger.count}
                        key={3}
                      />
                    )}
                    {nostatus && (
                      <ProgressBar
                        variant="light"
                        bsPrefix="text-dark progress"
                        now={(nostatus.count / total.count) * 100}
                        label={nostatus.count}
                        key={4}
                      />
                    )}
                  </ProgressBar>
                )}
              </Col>
            </Row>
          );
        })}
    </Container>
  );
}
