const mongoose = require('mongoose');

// 创建集合
const TourShema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    unique: true,
  },
  rating: { type: Number, default: 0.0 },
  price: { type: Number, required: [true, 'Tour price is required'] },
});

const Tour = mongoose.model('Tour', TourShema);

module.exports = Tour;
