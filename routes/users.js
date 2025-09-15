const express = require('express');
const { getAllUsers, getUser, updateUser, delUser, createUser } = require('../controller/users');
const authHandler = require('../controller/user');

const usersRouter = express.Router(authHandler.signup);

// auth
usersRouter.post('/signup', authHandler.signup).post('/login', authHandler.login);

usersRouter
  .post('/forgot-password', authHandler.forgotPassword)
  .patch('/reset-password/:resetToken', authHandler.resetPassword);

usersRouter.route('/').get(getAllUsers).post(createUser);
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(delUser);

module.exports = usersRouter;
