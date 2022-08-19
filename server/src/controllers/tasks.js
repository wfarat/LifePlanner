import {
  tasksModel,
  goalTasksModel,
  dayTasksModel,
  goalsModel,
} from '../models/models';
import { pool } from '../models/pool';

const findByUser = async (userId) => {
  const data = await tasksModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};
const findTaskById = async (taskId, userId) => {
  const data = await tasksModel.select(
    '*',
    ` WHERE id = ${taskId} AND user_id = ${userId}`
  );
  return data.rows[0];
};
export const findAllTasks = async (req, res, next) => {
  const tasks = await findByUser(req.userId);
  if (!tasks) {
    res.status(404).send({
      message: `User id ${req.userId} has no tasks created`,
    });
  } else {
    req.tasks = tasks;
    next();
  }
};
export const findTask = async (req, res, next, taskId) => {
  const task = await findTaskById(taskId, req.userId);
  if (!task) {
    res.status(404).send({ message: 'Task not found.' });
  } else {
    req.task = task;
    next();
  }
};
export const sendTasks = async (req, res) => {
  res.status(200).send({ tasks: req.tasks });
};

export const addTask = async (req, res) => {
  const {
    repeat, name, duration, description, goal, times
  } = req.body;
  if (goal && times > 0) {
    const columns = 'user_id, repeat, name, duration, description';
    const values = `${req.userId}, '{${repeat}}', '${name}', ${duration}, '${description}'`;
    const data = await tasksModel.insertWithReturn(columns, values);
    const task = data.rows[0];
    await goalTasksModel.insert(
      'goal_id, task_id, times',
      `${goal}, ${task.id}, ${times}`
    );
    await goalsModel.updateOne('times', `times + ${times}`, `id = ${goal}`);
    res.status(201).send({ task });
  } else {
    const columns = 'user_id, repeat, name, duration, description';
    const values = `${req.userId}, '{${repeat}}', '${name}', ${duration}, '${description}'`;
    const data = await tasksModel.insertWithReturn(columns, values);
    res.status(201).send({ task: data.rows[0] });
  }
};

export const deleteTask = async (req, res) => {
  await dayTasksModel.delete(`task_id = ${req.task.id}`);
  await goalTasksModel.delete(`task_id = ${req.task.id}`);
  await tasksModel.delete(`id = ${req.task.id}`);
  res.status(200).send({ taskId: req.task.id });
};

export const updateTask = async (req, res) => {
  const { keyName, val } = req.body;
  if (keyName === 'repeat') {
    const data = await tasksModel.updateOneWithReturn(
      keyName,
      `'{${val}}'`,
      `id = ${req.task.id}`
    );
    const task = data.rows[0];
    res.status(203).send({ task });
  } else {
    const data = await tasksModel.updateOneWithReturn(
      keyName,
      `'${val}'`,
      `id = ${req.task.id}`
    );
    const task = data.rows[0];
    res.status(203).send({ task });
  }
};

export const getAllTasksStats = async (req, res) => {
  const total = await pool.query(`SELECT COUNT(*), day_tasks.task_id
  FROM days, day_tasks
  WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId}
  GROUP BY day_tasks.task_id`);
  const success = await pool.query(`SELECT COUNT(*), day_tasks.task_id
  FROM days, day_tasks
  WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND day_tasks.status = 'success'
  GROUP BY day_tasks.task_id`);
  const danger = await pool.query(`SELECT COUNT(*), day_tasks.task_id
  FROM days, day_tasks
  WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND day_tasks.status = 'danger'
  GROUP BY day_tasks.task_id`);
  const warning = await pool.query(`SELECT COUNT(*), day_tasks.task_id
  FROM days, day_tasks
  WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND day_tasks.status = 'warning'
  GROUP BY day_tasks.task_id`);
  const nostatus = await pool.query(`SELECT COUNT(*), day_tasks.task_id
  FROM days, day_tasks
  WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND day_tasks.status = ''
  GROUP BY day_tasks.task_id`);
  const allStats = {
    total: total.rows,
    success: success.rows,
    danger: danger.rows,
    warning: warning.rows,
    nostatus: nostatus.rows
  }
  res.status(200).send({ allStats })
}