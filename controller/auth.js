const utils = require('node:util');
const crypto = require('node:crypto');

const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const Auth = require('../models/user');
const AppError = require('../utils/appError');
const { setPasswdEncryption } = require('../utils/setPasswdEncryption');

function setJWTToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRRES_IN,
  });
}

module.exports = {
  // protect 保护 验证登录状态禁止访问某些路由
  protect: catchAsync(async (req, res, next) => {
    // 验证令牌是否存在 Bearer -》 持票人
    const { authorization } = req.headers;
    let token = null;
    if (authorization && authorization.startsWith('Bearer')) {
      token = Reflect.get(authorization.split(' '), 1);
    }

    if (!token) return next(new AppError(`You are not logged in! Please log in to get access.`, 401));

    // 验证token 状态 解码 jwt token 还原用户id
    const decoded = await utils.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 验证用户是否存在
    const user = await Auth.findById(decoded.id).select('+password -__v');

    if (!user) return next(new AppError(`The user belonging to this token does not exist.`, 401));

    // 验证用户是否修改密码
    if (user.checkChangedPassword(decoded.iat))
      return next(new AppError(`User recently changed password. Please log in again.`, 401));

    Reflect.set(req, 'user', user);

    next();
  }),

  //  验证用户权限
  restrictTo: function (...roles) {
    return (req, res, next) => {
      console.log(req.user);
      // roles  = ['admin', 'lead-guide']
      if (!roles.includes(req.user.role))
        return next(new AppError('You do not have permission to perform this action', 403));

      next();
    };
  },

  //   注册
  signup: catchAsync(async (req, res, next) => {
    const { body } = req;
    const newUser = await Auth.create({
      name: body.name,
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
      // passwordChangeAt: body.passwordChangeAt,
      role: body.role,
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

  //    登录
  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 验证邮箱密码是否输入
    if (!email || !password) return next(new AppError('please provide email and password', 400));

    // 查询
    const user = await Auth.findOne({ email }).select('+password -__v');
    // 无法恢复已经加密的密码 验证时把登录的密码加密与数据库中的密码进行比较 方法封装在UserSchema实例上
    if (!user || !(await user.checkPassword(password))) return next(new AppError('Invalid email or password', 401));
    const jwtToken = setJWTToken(user._id);

    // const cookieOptions = {
    //   expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // };
    //
    // if (process.env.NODE_ENV === 'production') Reflect.set(cookieOptions, 'secure', true); // 标记cookie只能通过https传输
    //  同时返回cookie
    res.cookie('jwt', jwtToken, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 标记cookie只能通过https传输
    });

    res.json({
      status: 200,
      message: 'success',
      token: jwtToken,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: jwtToken,
      },
    });
  }),

  // 更新密码
  updatePassword: catchAsync(async (req, res, next) => {
    //  收集密码是否输入
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirm)
      return next(new AppError('Please provide currentPassword or newPassword or newPasswordConfirm!', 400));

    const { user } = req;

    // 检查新密码跟确认密码是否一致 多此一举
    // if (newPassword !== newPasswordConfirm)
    //   return next(new AppError('New password and newPasswordConfirm must be the same', 400));

    // 判断当前密码是否与之前密码一致
    if (!(await user.checkPassword(currentPassword))) return next(new AppError('Current password is wrong!', 401));

    // 新密码不能跟旧密码一样
    if (await user.checkPassword(newPassword)) return next(new AppError('不能使用之前一样的密码！', 401));

    // 修改新密码
    Reflect.set(user, 'password', newPassword);
    Reflect.set(user, 'passwordConfirm', newPasswordConfirm);
    await user.save();

    res.json({
      status: 200,
      message: '密码修改成功，请重新登录！',
    });
  }),

  // 忘记密码
  forgotPassword: catchAsync(async (req, res, next) => {
    let user = await Auth.findOne({ email: req.body.email });

    if (!user) return next(new AppError('There is no user with email address.', 404));

    const resetToken = user.createPasswordResetToken();
    user = await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}\n If you did not forget your password, please ignore this email! \n 你的刷新token是： ${resetToken}`;

    try {
      console.log(message);
      /*      await sendMail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
        // text: `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${process.env.BASE_URL}/api/v1/users/resetPassword/${resetToken}`,
      });*/

      res.json({
        status: 200,
        message: 'success',
      });
    } catch (e) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
  }),

  //  重置密码
  resetPassword: catchAsync(async (req, res, next) => {
    console.log(req.params.resetToken);
    // 加密获取的刷新令牌
    const hash = crypto.createHash('sha256');
    const restToken = hash.update(req.params.resetToken).digest('hex');
    console.log(restToken);

    // 检验数据库中是否存在该用户 同时校验token是否过期 查找 数据库中 passwordResetExpires  字段大于当前时间
    const user = await Auth.findOne({ passwordResetToken: restToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) return next(new AppError('token 失效或超时了', 400));

    // 更新密码
    const { password, passwordConfirm } = req.body;

    user.password = password;
    user.passwordConfirm = passwordConfirm;

    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    res.json({
      status: 200,
      message: 'reset password success! 请重新登录',
    });
  }),
};
