const express = require('express');
const { protect, restrictTo } = require('../controller/auth');
const { createReview, getAllReviews } = require('../controller/review');

const reviewRouter = express.Router();

reviewRouter.route('/:id').post(protect, restrictTo('user', 'admin', 'lead-guide'), createReview);

reviewRouter.route('/').get(protect, restrictTo('admin'), getAllReviews);

module.exports = reviewRouter;
