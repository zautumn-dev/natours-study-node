const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

module.exports = {
  signup: catchAsync(async (req, res, next) => {
    await User.create(req.body);

    res.status(201).json({
      message: 'success',
      status: 201,
    });
  }),
};
