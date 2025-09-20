const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  delUser,
  createUser,
  updateMyProfile,
  delMyProfile,
} = require('../controller/users');

console.log(typeof delMyProfile);

const authHandler = require('../controller/auth');
const { protect, restrictTo } = require('../controller/auth');

const usersRouter = express.Router(authHandler.signup);

// auth
usersRouter.post('/signup', authHandler.signup).post('/login', authHandler.login);

usersRouter
  .post('/forgot-password', authHandler.forgotPassword)
  .patch('/reset-password/:resetToken', authHandler.resetPassword)
  .patch('/update-password', authHandler.protect, authHandler.updatePassword)
  .patch('/update-my-profile', authHandler.protect, updateMyProfile)
  .delete('/del-my-profile', authHandler.protect, delMyProfile);

usersRouter.route('/').get(authHandler.protect, authHandler.restrictTo('admin'), getAllUsers).post(createUser);
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(protect, restrictTo('admin'), delUser);

module.exports = usersRouter;
