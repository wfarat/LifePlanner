import Model from '../models/model';

const tasksModel = new Model('tasks');
const goalTasksModel = new Model('goal_tasks');
const findByUser = async (userId) => {
  const data = await tasksModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};

export const findAllTasks = async (req, res, next) => {
  const tasks = await findByUser(req.user.id);
  if (!tasks) {
    res.status(404).send({
      message: `User id ${req.user.id} has no tasks created`,
    });
  } else {
    req.tasks = tasks;
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
    const values = `${req.user.id}, '{${repeat}}', '${name}', ${duration}, '${description}'`;
    const data = await tasksModel.insertWithReturn(columns, values);
    const task = data.rows[0];
    await goalTasksModel.insert(
      'goal_id, task_id, times',
      `${goal}, ${task.id}, ${times}`
    );
    res.status(201).send({ task });
  } else {
    const columns = 'user_id, repeat, name, duration, description';
    const values = `${req.user.id}, '{${repeat}}', '${name}', ${duration}, '${description}'`;
    const data = await tasksModel.insertWithReturn(columns, values);
    res.status(201).send({ task: data.rows[0] });
  }
};
