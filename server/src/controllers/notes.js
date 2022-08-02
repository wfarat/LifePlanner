import Model from '../models/model';

const notesModel = new Model('notes');

const findByUser = async (userId) => {
  const data = await notesModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};

export const findAllNotes = async (req, res, next) => {
  const notes = await findByUser(req.user.id);
  if (!notes) {
    res.status(404).send({
      message: `User id ${req.user.id} has no notes created`,
    });
  } else {
    req.notes = notes;
    next();
  }
};

export const sendNotes = async (req, res) => {
  res.status(200).send({ notes: req.notes });
};
