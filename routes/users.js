const express = require('express');
const { getAllUsers, getUser, updateUser, delUser, createUser, updateMyProfile } = require('../controller/users');
const authHandler = require('../controller/auth');

const usersRouter = express.Router(authHandler.signup);

// auth
usersRouter.post('/signup', authHandler.signup).post('/login', authHandler.login);

usersRouter
  .post('/forgot-password', authHandler.forgotPassword)
  .patch('/reset-password/:resetToken', authHandler.resetPassword)
  .patch('/update-password', authHandler.protect, authHandler.updatePassword)
  .patch('/update-my-profile', authHandler.protect, updateMyProfile);

usersRouter.route('/').get(getAllUsers).post(createUser);
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(delUser);

module.exports = usersRouter;
