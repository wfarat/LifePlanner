import {
  tasksModel,
  goalTasksModel,
  dayTasksModel,
  goalsModel,
  daysModel,
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
  const columns = 'user_id, repeat, name, duration, description';
  const values = `${req.userId}, '{${repeat}}', '${name}', ${duration}, '${description}'`;
  const data = await tasksModel.insertWithReturn(columns, values);
  const task = data.rows[0];
  if (goal && times > 0) {
    await goalTasksModel.insert(
      'goal_id, task_id, times',
      `${goal}, ${task.id}, ${times}`
    );
    await goalsModel.updateOne('times', `times + ${times}`, `id = ${goal}`);
  }
  if (repeat.length > 0) {
    const value = new Date();
    let d = value.getDate();
    if (d < 10) {
      d = `0${d}`;
    }
    let month = value.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    const year = value.getFullYear();
    const dayRef = Number(`${year}${month}${d}`);
    const daysData = await daysModel.select(
      'id',
      ` WHERE weekday = ANY ('{${repeat}}'::int[]) AND user_id = ${req.userId} AND day_ref >= ${dayRef}`
    );
    const days = daysData.rows;
    days.forEach(async (day) => {
      await dayTasksModel.insert('day_id, task_id', `${day.id}, ${task.id}`);
    });
  }
  res.status(201).send({ task });
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
    nostatus: nostatus.rows,
  };
  res.status(200).send({ allStats });
};

export const getStatsByDayRef = async (req, res) => {
  const { start, end } = req.body;
  if (start && end) {
    const total = await pool.query(`SELECT COUNT(*), day_tasks.task_id
    FROM days, day_tasks
    WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND days.day_ref >= ${start} AND days.day_ref <= ${end}
    GROUP BY day_tasks.task_id`);
    const success = await pool.query(`SELECT COUNT(*), day_tasks.task_id
    FROM days, day_tasks
    WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND day_tasks.status = 'success' AND days.day_ref >= ${start} AND days.day_ref <= ${end}
    GROUP BY day_tasks.task_id`);
    const danger = await pool.query(`SELECT COUNT(*), day_tasks.task_id
    FROM days, day_tasks
    WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND day_tasks.status = 'danger' AND days.day_ref >= ${start} AND days.day_ref <= ${end}
    GROUP BY day_tasks.task_id`);
    const warning = await pool.query(`SELECT COUNT(*), day_tasks.task_id
    FROM days, day_tasks
    WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND day_tasks.status = 'warning' AND days.day_ref >= ${start} AND days.day_ref <= ${end}
    GROUP BY day_tasks.task_id`);
    const nostatus = await pool.query(`SELECT COUNT(*), day_tasks.task_id
    FROM days, day_tasks
    WHERE days.id = day_tasks.day_id AND days.user_id = ${req.userId} AND day_tasks.status = '' AND days.day_ref >= ${start} AND days.day_ref <= ${end}
    GROUP BY day_tasks.task_id`);
    const allStats = {
      total: total.rows,
      success: success.rows,
      danger: danger.rows,
      warning: warning.rows,
      nostatus: nostatus.rows,
    };
    res.status(200).send({ allStats });
  } else {
    res.status(400).send();
  }
};
