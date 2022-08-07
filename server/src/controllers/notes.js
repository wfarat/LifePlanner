import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Model from '../models/model';

dayjs.extend(utc);

const notesModel = new Model('notes');

const findByUser = async (userId) => {
  const data = await notesModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};

export const findAllNotes = async (req, res, next) => {
  const notes = await findByUser(req.userId);
  if (!notes) {
    res.status(404).send({
      message: `User id ${req.userId} has no notes created`,
    });
  } else {
    req.notes = notes;
    next();
  }
};

export const sendNotes = async (req, res) => {
  res.status(200).send({ notes: req.notes });
};

export const addNote = async (req, res) => {
  const { title, content } = req.body;
  const time = dayjs.utc().local().toISOString();
  const columns = 'title, content, user_id, created, edited';
  const values = `'${title}', '${content}', ${req.userId}, '${time}', '${time}'`;
  const data = notesModel.insertWithReturn(columns, values);
  const note = data.rows[0];
  res.status(201).send({ note });
};
