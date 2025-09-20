const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');

const reviewController = {
  createReview: catchAsync(async (req, res, next) => {
    if (!req.body.user) req.body.user = req.user._id;
    if (!req.body.tour) req.body.tour = req.params.tourId;
    console.log(req.body);
    const review = await Review.create({
      ...req.body,
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
    const reviewQuery = req.params.tourId ? { tour: req.params.tourId } : {};
    const reviews = await Review.find(reviewQuery);

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
