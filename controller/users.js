const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/user');
const handlerFactory = require('../utils/handlerFactory');

const allowedUpdateFields = ['name', 'email'];

function filterUserProfileFields(info, ...allowedFields) {
  // const allowedFieldsList = Object.keys(info).filter((fields) => allowedFields.includes(fields));
  // const allowedObject = {};

  // allowedFieldsList.forEach((fields) => {
  //   Reflect.set(allowedObject, fields, Reflect.get(info, fields));
  // });
  //
  // allowedFields.forEach((fields) => {
  //   if (Reflect.get(info, fields)) Reflect.set(allowedObject, fields, Reflect.get(info, fields));
  // });

  return allowedFields.reduce((allowedObject, fields) => {
    if (Reflect.get(info, fields)) Reflect.set(allowedObject, fields, Reflect.get(info, fields));
    return allowedObject;
  }, {});
}

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.json({
    status: 200,
    message: 'success',
    data: {
      len: users.length,
      list: users,
    },
  });
});

function createUser(req, res) {
  res.status(500).json({
    status: 500,
    message: 'This route is not yet defined!',
  });
}

const updateMyProfile = catchAsync(async (req, res, next) => {
  // 排除password passwordConfirm
  const { body, user } = req;
  if (body.password || body.passwordConfirm)
    return next(new AppError('This route is not allowed to update password or passwordConfirm!', 400));

  // 部分更新用户信息 但排除role等部分 new: true  返回更新后的数据
  const updateData = filterUserProfileFields(body, ...allowedUpdateFields);

  const updateUser = await User.findByIdAndUpdate(user._id, updateData, { runValidators: true, new: true }).select(
    '-__v',
  );

  res.json({
    status: 200,
    message: 'success',
    data: updateUser,
  });
});

function updateUser(req, res) {
  res.status(500).json({
    status: 500,
    message: 'This route is not yet defined!',
  });
}

const userController = {
  delMyProfile: catchAsync(async (req, res, next) => {
    // 隐藏用户活动状态
    const { user = {} } = req;

    // 不用保存直接更新
    // await user.save({ validateBeforeSave: false });

    await User.findByIdAndUpdate(user._id, { active: false });

    res.status(204).json({
      status: 204,
      message: 'success',
      data: null,
    });
  }),
  delUser: handlerFactory.delOne(User),
  getMeMiddleware: (req, res, next) => {
    req.params.id = req.user._id;
    next();
  },
  getUser: handlerFactory.getOne(User),
};

module.exports = {
  getAllUsers,
  updateUser,
  createUser,
  updateMyProfile,
  ...userController,
};
