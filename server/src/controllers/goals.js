import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { goalTasksModel, goalsModel } from '../models/models';

dayjs.extend(utc);

const findByUser = async (userId) => {
  const data = await goalsModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};
const findTasksByGoal = async (goalId) => {
  const data = await goalTasksModel.select('*', ` WHERE goal_id = ${goalId}`);
  return data.rows;
};

const findTaskByTask = async (taskId, goalId) => {
  const data = await goalTasksModel.select(
    '*',
    ` WHERE task_id = ${taskId} AND id = ${goalId}`
  );
  return data.rows[0];
};
const findGoalById = async (goalId, userId) => {
  const data = await goalsModel.select(
    '*',
    ` WHERE id = ${goalId} AND user_id = ${userId}`
  );
  return data.rows[0];
};
const findGoalTaskById = async (goalTaskId) => {
  const data = await goalTasksModel.select('*', ` WHERE id = ${goalTaskId}`);
  return data.rows[0];
};
export const findAllGoals = async (req, res, next) => {
  const goals = await findByUser(req.userId);
  if (!goals) {
    res.status(404).send({
      message: `User id ${req.userId} has no goals created`,
    });
  } else {
    req.goals = goals;
    next();
  }
};
export const findGoal = async (req, res, next, goalId) => {
  const goal = await findGoalById(goalId, req.userId);
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
    res.status(404).send({ message: 'No tasks for this goal.' });
  } else {
    req.goalTasks = goalTasks;
    next();
  }
};

export const findGoalTask = async (req, res, next, goalTaskId) => {
  const goalTask = await findGoalTaskById(goalTaskId);
  if (!goalTask) {
    res.status(404).send({ message: 'Goal task not found.' });
  } else {
    req.goalTask = goalTask;
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
  const {
    description, name, tasksArray, startDate, endDate
  } = req.body;
  let goal;
  if (startDate && endDate) {
    const start = dayjs.utc(startDate).toISOString();
    const finish = dayjs.utc(endDate).toISOString();
    const columns = 'name, description, user_id, start, finish';
    const values = `'${name}', '${description}', ${req.userId}, '${start}', '${finish}'`;
    const data = await goalsModel.insertWithReturn(columns, values);
    [ goal ] = data.rows;
  } else {
    const columns = 'name, description, user_id';
    const values = `'${name}', '${description}', ${req.userId}`;
    const data = await goalsModel.insertWithReturn(columns, values);
    [ goal ] = data.rows;
  }
  if (tasksArray.length > 0) {
    tasksArray.forEach(async (task) => {
      await goalTasksModel.insert(
        'goal_id, task_id, times',
        `${goal.id}, ${task.id}, ${task.times}`
      );
      await goalsModel.updateOne(
        'times',
        `times + ${task.times}`,
        `id = ${goal.id}`
      );
    });
  }
  res.status(201).send({ goal });
};

export const addGoalTask = async (req, res) => {
  const { times, taskId } = req.body;
  const task = await findTaskByTask(taskId, req.goal.id);
  if (task) {
    res.status(400).send();
    return;
  }
  const columns = 'goal_id, task_id, times, done';
  const values = `${req.goal.id}, ${taskId}, ${times}, 0`;
  const data = await goalTasksModel.insertWithReturn(columns, values);
  await goalsModel.updateOne(
    'times',
    `times + ${times}`,
    `id = ${req.goal.id}`
  );
  const goalTask = data.rows[0];
  res.status(201).send({ goalTask });
};

export const deleteGoal = async (req, res) => {
  await goalTasksModel.delete(`goal_id = ${req.goal.id}`);
  await goalsModel.delete(`id = ${req.goal.id}`);
  res.status(200).send({ goalId: req.goal.id });
};

export const updateGoal = async (req, res) => {
  const { keyName, val } = req.body;
  const data = await goalsModel.updateOneWithReturn(
    keyName,
    `'${val}'`,
    `id = ${req.goal.id}`
  );
  const goal = data.rows[0];
  res.status(203).send({ goal });
};

export const removeGoalTask = async (req, res) => {
  await goalTasksModel.delete(`id = ${req.goalTask.id}`);
  await goalsModel.updateOne(
    'times',
    `times - ${req.goalTask.times}`,
    `id = ${req.goalTask.goal_id}`
  );
  res.status(200).send({ goalTaskId: req.goalTask.id });
};
