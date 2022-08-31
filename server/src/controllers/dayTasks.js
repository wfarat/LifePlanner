import {
  dayTasksModel,
  goalTasksModel,
  goalsModel,
  oneTimeTasksModel,
} from '../models/models';

const findDayTasks = async (dayId) => {
  const data = await dayTasksModel.select('*', ` WHERE day_id = ${dayId}`);
  return data.rows;
};

const findOneTimeTasks = async (dayId) => {
  const data = await oneTimeTasksModel.select('*', ` WHERE day_id = ${dayId}`);
  return data.rows;
};
const findDayTaskById = async (taskId) => {
  const data = await dayTasksModel.select('*', ` WHERE id = ${taskId}`);
  return data.rows[0];
};

const findOneTimeTaskById = async (taskId) => {
  const data = await oneTimeTasksModel.select('*', ` WHERE id = ${taskId}`);
  return data.rows[0];
};
export const sendDayTasks = async (req, res) => {
  const dayTasks = await findDayTasks(req.day.id);
  const oneTimeTasks = await findOneTimeTasks(req.day.id);
  if (!dayTasks || !oneTimeTasks) {
    res.status(404).send();
  } else {
    res.status(200).send({ dayTasks, oneTimeTasks });
  }
};
export const findDayTask = async (req, res, next, taskId) => {
  const dayTask = await findDayTaskById(taskId);
  if (dayTask) {
    req.dayTask = dayTask;
    next();
  } else {
    const oneTimeDayTask = await findOneTimeTaskById(taskId);
    if (!oneTimeDayTask) {
      res.status(404).send();
    } else {
      req.dayTask = oneTimeDayTask;
      next();
    }
  }
};
export const updateDayTask = async (req, res) => {
  const {
    taskId, status, comment, start, finish, oneTime
  } = req.body;
  let data;
  let pairs;
  if (start && finish) {
    pairs = [
      { column: 'status', value: `'${status}'` },
      { column: 'comment', value: `'${comment}'` },
      { column: 'start', value: `${start}` },
      { column: 'finish', value: `${finish}` },
    ];
  } else if (finish) {
    pairs = [
      { column: 'status', value: `'${status}'` },
      { column: 'comment', value: `'${comment}'` },
      { column: 'finish', value: `${finish}` },
    ];
  } else if (start) {
    pairs = [
      { column: 'status', value: `'${status}'` },
      { column: 'comment', value: `'${comment}'` },
      { column: 'start', value: `${start}` },
    ];
  } else {
    pairs = [
      { column: 'status', value: `'${status}'` },
      { column: 'comment', value: `'${comment}'` },
    ];
  }
  if (oneTime) {
    if (req.dayTask.status !== status) {
        data = await oneTimeTasksModel.updateWithReturn(
          pairs,
          `id = ${req.dayTask.id}`
        );
    } else {
      data = await oneTimeTasksModel.updateOneWithReturn(
        'comment',
        `'${comment}'`,
        `id = ${req.dayTask.id}`
      );
    }
  } else if (req.dayTask.status !== status) {
      if (status === 'success') {
        const goalData = await goalTasksModel.updateOneWithReturn(
          'done',
          'done + 1',
          `task_id = '${taskId}' AND times > done`
        );
        const goalTask = goalData.rows;
        goalTask.forEach(async (task) => {
          await goalsModel.updateOne(
            'done',
            'done + 1',
            `id = '${task.goal_id}'`
          );
        });
      }
      data = await dayTasksModel.updateWithReturn(
        pairs,
        `id = ${req.dayTask.id}`
      );
  } else {
    data = await dayTasksModel.updateOneWithReturn(
      'comment',
      `'${comment}'`,
      `id = ${req.dayTask.id}`
    );
  }
  const dayTask = data.rows[0];
  res.status(203).send({ dayTask, oneTime });
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
  const { oneTime } = req.body;
  if (oneTime) {
    await oneTimeTasksModel.delete(`id = ${req.dayTask.id}`);
  } else {
    await dayTasksModel.delete(`id = ${req.dayTask.id}`);
  }
  res.status(203).send({ id: req.dayTask.id, oneTime });
};

export const addOneTimeTask = async (req, res) => {
  const { name, description, start } = req.body;
  const columns = 'name, description, start, day_id';
  const values = `'${name}', '${description}', ${start}, ${req.day.id}`;
  await oneTimeTasksModel.insert(columns, values);
  res.status(201).send({ name });
};
