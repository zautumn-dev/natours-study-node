const express = require('express');
const { protect, restrictTo } = require('../controller/auth');
const { createReview, getAllReviews, delReview } = require('../controller/review');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/:id')
  .post(protect, restrictTo('user', 'admin', 'lead-guide'), createReview)
  .delete(protect, restrictTo('admin'), delReview);

reviewRouter
  .route('/')
  .get(protect, restrictTo('admin'), getAllReviews)
  .post(protect, restrictTo('user', 'admin', 'lead-guide'), createReview)
  .get(protect, restrictTo('user', 'admin', 'lead-guide'), getAllReviews);

module.exports = reviewRouter;
