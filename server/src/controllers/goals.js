import Model from '../models/model';

const goalsModel = new Model('goals');

const findByUser = async (userId) => {
  const data = await goalsModel.select('*', ` WHERE user_id = ${userId}`);
  return data.rows;
};

export const findAllGoals = async (req, res, next) => {
  const goals = await findByUser(req.user.id);
  if (!goals) {
    res.status(404).send({
      message: `User id ${req.user.id} has no goals created`,
    });
  } else {
    req.goals = goals;
    next();
  }
};

export const sendGoals = async (req, res) => {
  res.status(200).send({ goals: req.goals });
};
