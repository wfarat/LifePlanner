import { dayNotesModel } from '../models/models';

const findDayNotes = async (dayId) => {
  const data = await dayNotesModel.select('*', ` WHERE day_id = ${dayId}`);
  return data.rows;
};

const findDayNoteById = async (noteId) => {
    const data = await dayNotesModel.select('*', ` WHERE id = ${noteId}`);
    return data.rows[0];
}
export const sendDayNotes = async (req, res) => {
  const dayNotes = await findDayNotes(req.day.id);
  if (!dayNotes) {
    res.status(404).send();
  } else {
    res.status(200).send({ dayNotes });
  }
};

export const findDayNote = async (req, res, next, noteId) => {
    const dayNote = await findDayNoteById(noteId);
    if (!dayNote) {
        res.status(400).send();
    } else {
        req.dayNote = dayNote;
        next();
    }
}

export const addDayNote = async (req, res) => {
  const { title, content } = req.body;
    const data = await dayNotesModel.insertWithReturn(
      'day_id, title, content',
      `${req.day.id}, '${title}', '${content}'`
    );
  const dayNote = data.rows[0];
  res.status(201).send({ dayNote });
};

export const deleteDayNote = async (req, res) => {
    await dayNotesModel.delete(`id = ${req.dayNote.id}`);
    res.status(203).send({ id: req.dayNote.id });
};

export const updateDayNote = async (req, res) => {
    const { title, content } = req.body;
    const pairs = [
        { column: 'title', value: `'${title}'` },
        { column: 'content', value: `'${content}'` },
      ];
      const data = await dayNotesModel.updateWithReturn(pairs, `id = ${req.dayNote.id}`);
      const dayNote = data.rows[0];
      res.status(203).send({ dayNote });
};
