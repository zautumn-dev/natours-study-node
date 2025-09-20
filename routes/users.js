const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  delUser,
  createUser,
  updateMyProfile,
  delMyProfile,
  getMeMiddleware,
} = require('../controller/users');
const handlerFactory = require('../utils/handlerFactory');

const authHandler = require('../controller/auth');
const { protect, restrictTo } = require('../controller/auth');

const usersRouter = express.Router(authHandler.signup);

usersRouter.post('/signup', authHandler.signup).post('/login', authHandler.login);

usersRouter
  .post('/forgot-password', authHandler.forgotPassword)
  .patch('/reset-password/:resetToken', authHandler.resetPassword);

// ------- 以下必须登录才能访问 -------

usersRouter.use(authHandler.protect);

// TODO 用户更新自己信息
usersRouter
  .patch('/update-my-profile', updateMyProfile)
  .delete('/del-my-profile', delMyProfile)
  .get('/me', getMeMiddleware, getUser)
  .patch('/update-password', authHandler.updatePassword);

// ----以下必须管理员才能访问----
usersRouter.use(authHandler.restrictTo('admin'));

// TODO 管理员创建用户 管理员更新用户信息
usersRouter.route('/').post(createUser).get(authHandler.restrictTo('admin'), getAllUsers);

usersRouter.route('/:id').get(protect, getUser).patch(protect, updateUser).delete(protect, delUser);

module.exports = usersRouter;
