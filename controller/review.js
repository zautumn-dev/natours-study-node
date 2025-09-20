const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');

const reviewController = {
  createReview: catchAsync(async (req, res, next) => {
    const review = await Review.create({
      ...req.body,
      user: req.user._id,
      tour: req.params.id,
    });
    res.status(201).json({
      status: 201,
      message: 'success',
      data: {
        id: review._id,
      },
    });
  }),

  getAllReviews: catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
      status: 200,
      message: 'success',
      data: {
        len: reviews.length,
        list: reviews,
      },
    });
  }),
};

module.exports = reviewController;
