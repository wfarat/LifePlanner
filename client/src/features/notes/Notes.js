import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {FormattedMessage} from 'react-intl';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { selectNotes } from './notesSlice';
export default function Notes() {
  const notesData = useSelector(selectNotes);
  const { notes } = notesData;

  return (
    <Container>
      <Button variant="success" className="m-3" as={Link} to="add">
        <FormattedMessage id="button.addnote" />
      </Button>
      <Row>
        <Col>
          <h3><FormattedMessage id="notes.header" /></h3>
        </Col>
      </Row>
      <ListGroup>
        {notes.length > 0 &&
          notes.map((note) => {
            return (
              <ListGroup.Item action as={Link} to={`${note.id}`} key={note.id}>
                {note.title}
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </Container>
  );
}
