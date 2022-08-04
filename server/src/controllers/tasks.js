import Model from '../models/model';

const tasksModel = new Model('tasks');

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
    repeat, name, duration, description, goalId
  } = req.body;
  if (goalId) {
    const columns = 'user_id, repeat, name, duration, description, goal_id';
    const values = `${req.user.id}, '{${repeat}}', '${name}', ${duration}, '${description}', ${goalId}`;
    const data = await tasksModel.insertWithReturn(columns, values);
    res.status(201).send({ task: data.rows[0] });
  } else {
    const columns = 'user_id, repeat, name, duration, description';
    const values = `${req.user.id}, '{${repeat}}', '${name}', ${duration}, '${description}'`;
    const data = await tasksModel.insertWithReturn(columns, values);
    res.status(201).send({ task: data.rows[0] });
  }
};
