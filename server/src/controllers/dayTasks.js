import { dayTasksModel, goalTasksModel, goalsModel } from '../models/models';

const findDayTasks = async (dayId) => {
  const data = await dayTasksModel.select('*', ` WHERE day_id = ${dayId}`);
  return data.rows;
};

const findDayTaskById = async (taskId) => {
  const data = await dayTasksModel.select('*', ` WHERE id = ${taskId}`);
  return data.rows[0];
};
export const sendDayTasks = async (req, res) => {
  const dayTasks = await findDayTasks(req.day.id);
  if (!dayTasks) {
    res.status(404).send();
  } else {
    res.status(200).send({ dayTasks });
  }
};
export const findDayTask = async (req, res, next, taskId) => {
  const dayTask = await findDayTaskById(taskId);
  if (!dayTask) {
    res.status(404).send();
  } else {
    req.dayTask = dayTask;
    next();
  }
};
export const updateDayTask = async (req, res) => {
  const { taskId, status, comment, start, finish } = req.body;
  let data;
  if (start) {
  const pairs = [
    { column: 'status', value: `'${status}'` },
    { column: 'comment', value: `'${comment}'` },
    { column: 'start', value: `${start}`},
    { column: 'finish', value: `${finish}`}
  ];
   data = await dayTasksModel.updateWithReturn(
    pairs,
    `id = ${req.dayTask.id}`
  );
} else {
  const pairs = [
    { column: 'status', value: `'${status}'` },
    { column: 'comment', value: `'${comment}'` },
    { column: 'finish', value: `${finish}`}
  ];
  if (status === 'success') {
    const goalData = await goalTasksModel.updateOneWithReturn(
      'done',
      'done + 1',
      `task_id = '${taskId}' AND times > done`
    );
    const goalTask = goalData.rows;
    goalTask.forEach(async (task) => {
      await goalsModel.updateOne('done', 'done + 1', `id = '${task.goal_id}'`);
    });
  }
   data = await dayTasksModel.updateWithReturn(
    pairs,
    `id = ${req.dayTask.id}`
  ); }
  const dayTask = data.rows[0];
  res.status(203).send({ dayTask });
};

export const addDayTask = async (req, res) => {
  const { taskId, start, finish } = req.body;
  let data;
  if (start > 0) {
    data = await dayTasksModel.insertWithReturn(
      'day_id, task_id, start, finish',
      `${req.day.id}, ${taskId}, ${start}, ${finish}`
    );
  } else {
    data = await dayTasksModel.insertWithReturn(
      'day_id, task_id',
      `${req.day.id}, ${taskId}`
    );
  }
  const dayTask = data.rows[0];
  res.status(201).send({ dayTask });
};

export const deleteDayTask = async (req, res) => {
  await dayTasksModel.delete(`id = ${req.dayTask.id}`);
  res.status(203).send({ id: req.dayTask.id });
};
