import {
  dayNotesModel,
  dayTasksModel,
  daysModel,
  goalTasksModel,
  goalsModel,
} from '../models/models';

const findDay = async (userId, dayRef) => {
  const data = await daysModel.select(
    '*',
    ` WHERE user_id = ${userId} AND day_ref = ${dayRef}`
  );
  return data.rows[0];
};

const findDayTasks = async (dayId) => {
  const data = await dayTasksModel.select('*', ` WHERE day_id = ${dayId}`);
  return data.rows;
};

const findDayNotes = async (dayId) => {
  const data = await dayNotesModel.select('*', ` WHERE day_id = ${dayId}`);
  return data.rows;
};

export const sendDay = async (req, res) => {
  const day = await findDay(req.userId, req.params.dayRef);
  if (!day) {
    res.status(400).send();
  } else {
    const dayTasks = await findDayTasks(day.id);
    const dayNotes = await findDayNotes(day.id);
    const dayData = {
      day,
      dayTasks,
      dayNotes,
    };
    res.status(200).send(dayData);
  }
};

export const addDay = async (req, res) => {
  const { tasks, comment, notes } = req.body;
  const dayCheck = await findDay(req.userId, req.params.dayRef);
  if (dayCheck) {
    res.status(400).send();
  } else {
    const data = await daysModel.insertWithReturn(
      'day_ref, user_id, comment',
      `${req.params.dayRef}, ${req.userId}, '${comment}'`
    );
    const day = data.rows[0];
    tasks.forEach(async (task) => {
      if (!task.start && !task.finish) {
        await dayTasksModel.insert(
          'day_id, task_id, status',
          `${day.id}, ${task.id}, 'todo'`
        );
      } else {
        const columns = 'day_id, task_id, start, finish, status';
        const values = `${day.id}, ${task.id},${task.start}, ${task.finish}, 'todo'`;
        await dayTasksModel.insert(columns, values);
      }
    });
    notes.forEach(async (note) => {
      if (note.title) {
        await dayNotesModel.insert(
          'day_id, title, content',
          `${day.id}, '${note.title}', '${note.content}'`
        );
      } else {
        await dayNotesModel.insert(
          'day_id, content',
          `${day.id}, '${day.content}'`
        );
      }
    });
    res.status(201).send();
  }
};

export const updateDayTask = async (req, res) => {
  const {
    dayTaskId, taskId, status, comment
  } = req.body;
  const pairs = [
    { column: 'status', value: `'${status}'` },
    { column: 'comment', value: `'${comment}'` },
  ];
  let log;
  if (status === 'success') {
    const data = await goalTasksModel.updateOneWithReturn(
      'done',
      'done + 1',
      `task_id = '${taskId}' AND times > done`
    );
    const goalTask = data.rows;
    goalTask.forEach(async (task) => {
      await goalsModel.updateOne('done', 'done + 1', `id = '${task.goal_id}'`);
    });
  }
  const data = await dayTasksModel.updateWithReturn(pairs, `id = ${dayTaskId}`);
  const dayTask = data.rows[0];
  res.status(203).send({ dayTask });
};
