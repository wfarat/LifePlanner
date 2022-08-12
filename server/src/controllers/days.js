import { daysModel } from '../models/models';

const findDayByDayRef = async (userId, dayRef) => {
  const data = await daysModel.select(
    '*',
    ` WHERE user_id = ${userId} AND day_ref = ${dayRef}`
  );
  return data.rows[0];
};

export const findDay = async (req, res, next) => {
  const day = await findDayByDayRef(req.userId, req.params.dayRef);
  if (!day) {
    res.status(400).send();
  } else {
    req.day = day;
    next();
  }
};

export const sendDay = async (req, res) => {
  res.status(200).send({ day: req.day });
};

export const addDay = async (req, res) => {
  const { comment, dayRef } = req.body;
  const dayCheck = await findDayByDayRef(req.userId, dayRef);
  if (dayCheck) {
    res.status(400).send();
  } else {
    const data = await daysModel.insertWithReturn(
      'day_ref, user_id, comment',
      `${dayRef}, ${req.userId}, '${comment}'`
    );
    const day = data.rows[0];
    res.status(201).send({ day });
  }
};
