import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/users/userSlice';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { FormattedMessage, useIntl } from 'react-intl';
import Container from 'react-bootstrap/esm/Container';

import {
  addOneTimeTask,
  clearName,
  selectDayTasks,
} from '../../features/dayTasks/dayTasksSlice';
export default function AddOneTimeTask() {
  const user = useSelector(selectUser);
  const intl = useIntl();
  const dayTasksData = useSelector(selectDayTasks);
  const [startDate, setStartDate] = useState(new Date());
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const handleClick = async () => {
    if (name) {
      if (!description) {
        setDescription(intl.formatMessage({ id: 'description.empty' }));
      }
      setMessage('');
      let day = startDate.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      let month = startDate.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      const year = startDate.getFullYear();
      const dateString = `${year}${month}${day}`;
      const start = startDate.getHours() * 60 + (startDate.getMinutes() + 1);
      const data = {
        accessToken: user.accessToken,
        dayRef: dateString,
        dayTask: {
          name,
          description,
          start,
        },
      };
      dispatch(addOneTimeTask(data));
      setTimeout(() => {
        dispatch(clearName());
      }, 5000)
    } else {
      setMessage(intl.formatMessage({ id: 'message.taskname' }));
    }
  };
  return (
    <Container>
      <Form className="taskForm">
        <Form.Text className="fs-5 text-light">
          <FormattedMessage id="tasks.add" />
        </Form.Text>
        <Form.Group className="mb-2" controlId="formBasicName">
          <Form.Label>
            <FormattedMessage id="tasks.name" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            value={name}
            type="text"
            placeholder={intl.formatMessage({ id: 'tasks.nameplaceholder' })}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formDescription">
          <Form.Label>
            <FormattedMessage id="form.description" />
          </Form.Label>
          <Form.Control
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            as="textarea"
            rows={3}
            placeholder={intl.formatMessage({
              id: 'tasks.descriptionplaceholder',
            })}
          />
        </Form.Group>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          withPortal
        />
        <Form.Text className="text-danger">{message}</Form.Text>
        {dayTasksData.name && (
          <Alert variant="success">
            <FormattedMessage id="message.addtasksuccess" /> {dayTasksData.name}
          </Alert>
        )}
        <Button variant="success" onClick={handleClick}>
          <FormattedMessage id="button.submit" />
        </Button>
      </Form>
    </Container>
  );
}
