import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { notesModel } from '../models/models';

dayjs.extend(utc);

const findByUser = async (userId) => {
  const data = await notesModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};

const findNoteById = async (noteId, userId) => {
  const data = await notesModel.select(
    '*',
    ` WHERE id = ${noteId} AND user_id = ${userId}`
  );
  return data.rows[0];
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

export const findNote = async (req, res, next, noteId) => {
  const note = await findNoteById(noteId, req.userId);
  if (!note) {
    res.status(404).send({ message: 'Note not found.' });
  } else {
    req.note = note;
    next();
  }
};

export const addNote = async (req, res) => {
  const { title, content } = req.body;
  const time = dayjs.utc().local().toISOString();
  const columns = 'title, content, user_id, created, edited';
  const values = `'${title}', '${content}', ${req.userId}, '${time}', '${time}'`;
  const data = await notesModel.insertWithReturn(columns, values);
  const note = data.rows[0];
  res.status(201).send({ note });
};
export const deleteNote = async (req, res) => {
  await notesModel.delete(`id = ${req.note.id}`);
  res.status(200).send({ noteId: req.note.id });
};

export const updateNote = async (req, res) => {
  const { keyName, val } = req.body;
    const data = await notesModel.updateOneWithReturn(
      keyName,
      `'${val}'`,
      `id = ${req.note.id}`
    );
    const note = data.rows[0];
    res.status(203).send({ note });
};
