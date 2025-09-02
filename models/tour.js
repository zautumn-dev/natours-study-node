const mongoose = require('mongoose');

// 创建集合
const TourShema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    // 唯一性校验
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Tour duration is required'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour max group size is required'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour difficulty is required'],
  },

  ratingAverage: {
    type: Number,
    default: 3.9,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  rating: { type: Number, default: 4.1 },
  price: { type: Number, required: [true, 'Tour price is required'] },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour summary is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Tour cover image is required'],
  },
  images: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', TourShema);

module.exports = Tour;
