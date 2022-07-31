import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import { OAuth2Client, UserRefreshClient } from 'google-auth-library';
import Model from '../models/model';
import { addUser, findByEmail } from '../controllers/users';
import {
  googleClientID,
  googleClientSecret,
  jwtSecret,
  test,
} from '../settings';

const usersModel = new Model('users');
const authRouter = express.Router();
const oAuth2Client = new OAuth2Client(
  googleClientID,
  googleClientSecret,
  'postmessage'
);

authRouter.post('/auth/google', async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  const profile = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: googleClientID,
  });
  const { email } = profile.payload;
  const lastname = profile.payload.family_name;
  const firstname = profile.payload.given_name;
  let user;
  user = await findByEmail(email);
  if (!user) {
    const columns = 'email, firstname, lastname';
    const values = `'${email}', '${firstname}', '${lastname}'`;
    const data = await usersModel.insertWithReturn(columns, values);
    [ user ] = data.rows;
  }
  const token = jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: 86400, // 24 hours
  });
  res.send({
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
    accessToken: token,
    auth: true,
    message: '',
  });
});

export const checkAuth = (req, res, next) => {
  if (test === 'true') {
    next();
  } else {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(403).send({
        message: 'No token provided!',
      });
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: 'Unauthorized!',
        });
      }
      req.userId = decoded.id;
      next();
    });
  }
};
authRouter.post('/auth/google/refresh-token', async (req, res) => {
  const user = new UserRefreshClient(
    googleClientID,
    googleClientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  if (!user) {
    res.status(400).send();
    return;
  }
  bcrypt.compare(password, user.password, async (err, result) => {
    if (err) {
      res.status(400).send(err);
    }
    if (!result) {
      res.status(400).send();
      return;
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: 86400, // 24 hours
    });
    res.send({
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      accessToken: token,
      auth: true,
      message: '',
    });
  });
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Create an user.
 *     description: Creates a new user in database if email doesn't already exist in database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The user's full name.
 *                 example: Leanne Graham
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: 41589uwfdusad12
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: example@gmail.com
 *     tags:
 *      - Users
 *     responses:
 *       201:
 *         description: users
 */
authRouter.post('/register', addUser);

export default authRouter;
