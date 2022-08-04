import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Model from '../models/model';

dayjs.extend(utc);

const goalsModel = new Model('goals');

const findByUser = async (userId) => {
  const data = await goalsModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};

export const findAllGoals = async (req, res, next) => {
  const goals = await findByUser(req.user.id);
  if (!goals) {
    res.status(404).send({
      message: `User id ${req.user.id} has no goals created`,
    });
  } else {
    req.goals = goals;
    next();
  }
};

export const sendGoals = async (req, res) => {
  res.status(200).send({ goals: req.goals });
};

export const addGoal = async (req, res) => {
  const { description, duration, name } = req.body;
  const time = dayjs.utc().local().toISOString();
  const columns = 'name, description, duration, user_id, created, edited';
  const values = `'${name}', '${description}', ${duration}, ${req.user.id}, '${time}', '${time}'`;
  const data = await goalsModel.insertWithReturn(columns, values);
  const goal = data.rows[0];
  res.status(201).send({ goal });
};
