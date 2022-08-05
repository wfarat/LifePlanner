import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddDay from '../../components/AddDay/AddDay';
import { selectUser } from '../users/userSlice';
import { getDay, selectDay } from './daySlice';

export default function Day() {
  const day = useSelector(selectDay);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const params = useParams();
  useEffect(() => {
    const data = {
      dayRef: params.dayRef,
      accessToken: user.accessToken,
      userId: user.user.id,
    };
    dispatch(getDay(data));
  }, [params.dayRef]);

  return (
    <div>
      {day.day.comment}
      {day.day.length === 0 && <AddDay dayRef={params.dayRef}/>}
    </div>
  );
}
