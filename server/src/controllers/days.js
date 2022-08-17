import { daysModel, dayTasksModel, tasksModel } from '../models/models';

const findDayByDayRef = async (userId, dayRef) => {
  const data = await daysModel.select(
    '*',
    ` WHERE user_id = ${userId} AND day_ref = ${dayRef}`
  );
  return data.rows[0];
};

export const findDay = async (req, res, next) => {
  const { dayRef } = req.params;
  let day = await findDayByDayRef(req.userId, dayRef);
  if (!day) {
    const data = await daysModel.insertWithReturn(
      'day_ref, user_id',
      `${dayRef}, ${req.userId}`
    );
    [ day ] = data.rows;

    const dateYear = dayRef.slice(0, 4);
    const dateMonth = dayRef.slice(4, 6);
    const dateDay = dayRef.slice(6, 8);

    const dateCompiled = new Date(`${dateYear}-${dateMonth}-${dateDay}`);

    const weekDay = dateCompiled.getDay();
    const tasksData = await tasksModel.select(
      'id',
      ` WHERE repeat @> '{${weekDay}}'::int[] AND user_id = ${req.userId}`
    );
    const tasks = tasksData.rows;
    tasks.forEach(async (task) => {
      await dayTasksModel.insert('day_id, task_id', `${day.id}, ${task.id}`);
    });
  }
  req.day = day;
  next();
};

export const sendDay = async (req, res) => {
  res.status(200).send({ day: req.day });
};

export const addDay = async (req, res) => {
  const { comment, dayRef, weekDay } = req.body;
  const dayCheck = await findDayByDayRef(req.userId, dayRef);
  if (dayCheck) {
    res.status(400).send();
  } else {
    const data = await daysModel.insertWithReturn(
      'day_ref, user_id, comment',
      `${dayRef}, ${req.userId}, '${comment}'`
    );
    const day = data.rows[0];
    const tasksData = await tasksModel.select(
      'id',
      ` WHERE repeat @> '{${weekDay}}'::int[] AND user_id = ${req.userId}`
    );
    const tasks = tasksData.rows;
    tasks.forEach(async (task) => {
      await dayTasksModel.insert('day_id, task_id', `${day.id}, ${task.id}`);
    });
    res.status(201).send({ day });
  }
};

export const updateDay = async (req, res) => {
  const { comment, dayRef } = req.body;
  const data = await daysModel.updateOneWithReturn(
    'comment',
    `'${comment}'`,
    `day_ref = ${dayRef}`
  );
  const day = data.rows[0];
  res.status(201).send({ day });
};
