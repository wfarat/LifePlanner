/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import { usersModel } from '../models/models';
import { adminEmail } from '../settings';

const findById = async (id) => {
  const clause = ` WHERE id='${id}'`;
  const data = await usersModel.select('*', clause);
  const user = data.rows[0];
  return user;
};

export const findByEmail = async (email) => {
  const clause = ` WHERE email='${email}'`;
  const data = await usersModel.select('*', clause);
  const user = data.rows[0];
  return user;
};
export const findUser = async (req, res, next, userId) => {
  const user = await findById(userId);
  if (!user) {
    res.status(404).send({ message: `User id ${userId} doesn't exist` });
  } else {
    req.user = user;
    next();
  }
};

export const updateLanguage = async (req, res) => {
  const { lang } = req.user;
  const { newLang } = req.body;
  if (lang === newLang) {
    res.status(400).send();
  } else {
    const data = await usersModel.updateOneWithReturn(
      'lang',
      `'${newLang}'`,
      `id = ${req.userId}`
    );
    const user = data.rows[0];
    res.status(203).send({ lang: user.lang });
  }
};

export const checkUser = async (req, res, next) => {
  if (req.user.id !== req.userId) {
    res.status(400).send();
  } else {
    next();
  }
};
export const selectAllUsers = async (req, res) => {
  const columns = 'id, firstname, lastname, email';
  const data = await usersModel.select(columns);
  res.status(200).send({ users: data.rows });
};
export const checkAdmin = async (req, res, next) => {
  const user = await findById(req.userId);
  if (user.email !== adminEmail) {
    res.status(400).send();
  } else {
    next();
  }
};
export const addUser = async (req, res, next) => {
  const {
    email, password, firstname, lastname, lang
  } = req.body;
  const checkIfExists = await findByEmail(email);
  if (checkIfExists) {
    res.status(400).send({ message: 'User with this email already exists.' });
  } else {
    const columns = 'email, password, firstname, lastname, lang';
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return next(err);
        }
        const values = `'${email}', '${hash}','${firstname}', '${lastname}', '${lang}'`;
        const user = await usersModel.insertWithReturn(columns, values);
        res.status(201).send({ user: user.rows[0].firstname });
      });
    });
  }
};
export const selectUser = async (req, res) => {
  const {
    id, firstname, lastname, email, lang
  } = req.user;
  const user = {
    id,
    firstname,
    lastname,
    email,
    lang,
  };
  res.status(200).send({ user });
};

export const updateUser = async (req, res) => {
  const {
    email, firstname, lastname, password
  } = req.body;
  bcrypt.compare(password, req.user.password, async (err, result) => {
    if (!result) {
      res.status(400).send({ message: 'Incorrect password.' });
      return;
    }
    const clause = `id = ${req.user.id}`;
    if (req.user.email !== email) {
      await usersModel.updateOne('email', email, clause);
    }
    if (req.user.firstname !== firstname) {
      await usersModel.updateOne('firstname', firstname, clause);
    }
    if (req.user.lastname !== lastname) {
      await usersModel.updateOne('lastname', lastname, clause);
    }
    const updatedUser = await findById(req.user.id);
    if (updatedUser) {
      const {
        id, fn, ln, e, lang
      } = updatedUser;
      const user = {
        id,
        firstname: fn,
        lastname: ln,
        email: e,
        lang,
      };
      res.status(203).send({ user });
    }
  });
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const clause = `id = ${req.user.id}`;
  if (!req.user.password) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newPassword, salt, async (err, hash) => {
        if (err) {
          res.status(400).send(err);
        }
        await usersModel.updateOne('password', hash, clause);
        res.status(203).send({ message: 'Password changed successfuly.' });
      });
    });
  } else {
    bcrypt.compare(oldPassword, req.user.password, (err, result) => {
      if (err) {
        res.status(400).send(err);
      }
      if (!result) {
        res.status(400).send({ message: 'Incorrect password.' });
        return;
      }
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(newPassword, salt, async (err, hash) => {
          if (err) {
            res.status(400).send(err);
          }
          await usersModel.updateOne('password', hash, clause);
          res.status(203).send({ message: 'Password changed successfuly.' });
        });
      });
    });
  }
};

export const deleteUser = async (req, res) => {
  await usersModel.delete(`id = ${req.user.id}`);
  res
    .status(200)
    .send({ message: `User id ${req.user.id} is successfuly deleted.` });
};
