import Model from '../models/model';

const daysModel = new Model('days');
const dayTasksModel = new Model('day_tasks');
const dayNotesModel = new Model('day_notes');

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
  const day = await findDay(req.user.id, req.params.dayRef);
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
