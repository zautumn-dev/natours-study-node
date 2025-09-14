const crypto = require('node:crypto');
const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    unique: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    validate: [validator.isEmail, 'Please enter a valid email'],
    lowercase: true,
    unique: true,
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
    maxlength: 16,
    minlength: 3,
    select: false, // 隐藏密码字段 在查询到数据的时候
  },
  passwordConfirm: {
    type: String,
    maxlength: 16,
    minlength: 3,
    required: [true, 'User passwordConfirm is required'],
    select: false,
    validate: {
      // 校验只在创建跟保存时生效 。更新并不会触发
      validator: function (val) {
        return this.password === val;
      },
      message: 'Password and passwordConfirm must be the same',
    },
  },
  passwordChangeAt: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // 判断 是否修改过密码 没修改密码直接跳过密码加密
  if (!this.isModified('password')) return next();

  //  加密密码
  const salt = await bcryptjs.genSalt(12);
  const cryptedPassword = await bcryptjs.hash(this.password, salt);
  Reflect.set(this, 'password', cryptedPassword);

  // passwordConfirm 不做数据库持久化 只是对表单输入的密码进行确认校验
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (userPassword) {
  // 可以通过this 获取到实例
  return await bcryptjs.compare(userPassword, this.password);
};

userSchema.methods.checkChangedPassword = function (jwtTimestamp) {
  if (!this.passwordChangeAt) return false;

  const changedTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);

  // 发行的jwt令牌时间戳小于修改密码的时间戳表示 令牌过期 返回true
  return jwtTimestamp < changedTimestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 数据库存储校验的hash值 token
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  console.log(this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = model('user', userSchema);

module.exports = User;
