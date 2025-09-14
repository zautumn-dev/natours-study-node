const jsonwebtoken = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const AppError = require('../utils/appError');

function setJWTToken(id) {
  return jsonwebtoken.sign({ id }, process.env.JWT_EXPIRRES_IN, {
    expiresIn: process.env.JWT_EXPIRRES_IN,
  });
}

module.exports = {
  signup: catchAsync(async (req, res, next) => {
    const { body } = req;
    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
    });

    // 生成token
    // const token = jsonwebtoken.sign({ id: newUser._id }, process.env.JWT_EXPIRRES_IN, {
    //   expiresIn: process.env.JWT_EXPIRRES_IN,
    // });

    res.status(201).json({
      message: 'success',
      status: 201,
    });
  }),

  // login
  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 验证邮箱密码是否输入
    if (!email || !password) return next(new AppError('please provide email and password', 400));

    // 查询
    const user = await User.findOne({ email }).select('+password -__v');

    // 无法恢复已经加密的密码 验证时把登录的密码加密与数据库中的密码进行比较 方法封装在UserSchema实例上
    if (!user || !(await user.checkPassword(password))) return next(new AppError('Invalid email or password', 401));

    res.json({
      status: 200,
      message: 'success',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: setJWTToken(user._id),
      },
    });
  }),
};
