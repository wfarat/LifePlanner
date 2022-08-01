import express from 'express';
import {
  deleteUser,
  findUser,
  selectAllUsers,
  selectUser,
  updatePassword,
  updateUser,
} from '../controllers/users';
import { checkAuth } from './auth';

const usersRouter = express.Router();
usersRouter.use(checkAuth);
usersRouter.param('userId', findUser);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns users
 *     description: Returns all users from database
 *     tags:
 *      - Users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 */
usersRouter.get('/', selectAllUsers);
/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Returns user by ID
 *     description: Returns specific user from database if exists.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     tags:
 *      - Users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 */
usersRouter.get('/:userId', selectUser);
/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update an user details.
 *     description: Update an user email or/and fullname in database if exists.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Numeric ID of the user to update.
 *         schema:
 *           type: integer
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
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: example@gmail.com
 *     tags:
 *      - Users
 *     responses:
 *       203:
 *         description: users
 */
usersRouter.put('/:userId', updateUser);
/**
 * @swagger
 * /users/{userId}/password:
 *   put:
 *     summary: Update an user password.
 *     description: Update an user password in database if exists.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Numeric ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's old password.
 *                 example: 41589uwfdusad12
 *               newPassword:
 *                 type: string
 *                 description: The user's new password
 *                 example: t123asfdas1234
 *     tags:
 *      - Users
 *     responses:
 *       203:
 *         description: users
 */
usersRouter.put('/:userId/password', updatePassword);
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Deletes user by ID
 *     description: Deletes specific user from database
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Numeric ID of the user to delete.
 *         schema:
 *           type: integer
 *     tags:
 *      - Users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 */
usersRouter.delete('/:userId', deleteUser);

export default usersRouter;
