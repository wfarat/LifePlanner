import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Model from '../models/model';

dayjs.extend(utc);

const goalsModel = new Model('goals');
const goalTasksModel = new Model('goal_tasks');

const findByUser = async (userId) => {
  const data = await goalsModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};
const findTasksByGoal = async (goalId) => {
  const data = await goalTasksModel.select('*', ` WHERE goal_id = ${goalId}`);
  return data.rows;
};
const findGoalById = async (goalId, userId) => {
  const data = await goalsModel.select(
    '*',
    ` WHERE id = ${goalId} AND user_id = ${userId}`
  );
  return data.rows[0];
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
export const findGoal = async (req, res, next, goalId) => {
  const goal = await findGoalById(goalId, req.user.id);
  if (!goal) {
    res.status(404).send({ message: 'Goal not found.' });
  } else {
    req.goal = goal;
    next();
  }
};
export const findGoalTasks = async (req, res, next) => {
  const goalTasks = await findTasksByGoal(req.goal.id);
  if (!goalTasks) {
    res.status(404).send({ message: 'No goals for this goal.' });
  } else {
    req.goalTasks = goalTasks;
    next();
  }
};
export const sendGoalTasks = async (req, res) => {
  res.status(200).send({ goalTasks: req.goalTasks });
};
export const sendGoals = async (req, res) => {
  res.status(200).send({ goals: req.goals });
};

export const addGoal = async (req, res) => {
  const { description, name, tasksArray } = req.body;
  const time = dayjs.utc().local().toISOString();
  const columns = 'name, description, user_id, created, edited';
  const values = `'${name}', '${description}', ${req.user.id}, '${time}', '${time}'`;
  const data = await goalsModel.insertWithReturn(columns, values);
  const goal = data.rows[0];
  if (tasksArray.length > 0) {
    tasksArray.map(async (task) => {
      await goalTasksModel.insert(
        'goal_id, task_id, times',
        `${goal.id}, ${task.id}, ${task.times}`
      );
    });
  }
  res.status(201).send({ goal });
};
