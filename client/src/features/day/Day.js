import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectUser } from '../users/userSlice';
import { getDay } from './daySlice';

export default function Day() {
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
  return <div></div>;
}
