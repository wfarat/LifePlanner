import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../users/userSlice';
import { getGoals, selectGoals } from './goalsSlice';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export default function Goals() {
    const goalsData = useSelector(selectGoals);
    const { goals } = goalsData;
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    useEffect(() => {
        const data = {
            userId: user.user.id,
            accessToken: user.accessToken
        }
        if (goals.length === 0) {
            dispatch(getGoals(data));
        }
    })  
    return (
        <Container>
            <Button variant="primary" as={Link} to="add">Add Goal</Button>
                        <Row>
                <Col>Goal name:</Col>
                <Col>Created:</Col>
                <Col>Edited:</Col>
            </Row>
            {goals.length > 0 && goals.map((goal => {
                return (
                    <Row as={Link} key={`${goal.id}`} to={goal.id}>
                    <Col>{goal.name}</Col>
                    <Col>{goal.created}</Col>
                    <Col>{goal.edited}</Col>
                </Row>
                )
            }))}
        </Container> 
    )
}