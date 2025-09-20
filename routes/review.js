const express = require('express');
const { protect, restrictTo } = require('../controller/auth');
const { createReview, getAllReviews, delReview, setTourUserId } = require('../controller/review');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(protect);

reviewRouter
  .route('/:id')
  .post(restrictTo('user', 'admin'), setTourUserId, createReview)
  .delete(restrictTo('user', 'admin'), delReview);

reviewRouter
  .route('/')
  .get(restrictTo('admin'), getAllReviews)
  .post(restrictTo('user', 'admin'), setTourUserId, createReview);

module.exports = reviewRouter;
