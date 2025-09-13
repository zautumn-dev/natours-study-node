const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// 创建集合
const TourShema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required'],
      // 唯一性校验 但不是校验器
      unique: true,
      trim: true,
      //   maxlength,  minlength 最大长度最小长度校验
      minlength: [6, 'Tour name must be longer than 10 characters'],

      // 引入外部校验库
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    secretField: {
      type: String,
      select: false, // 默认隐藏
    },
    slug: String,
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
      enum: {
        // enum 枚举值校验 easy medium difficult
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },

    ratingAverage: {
      type: Number,
      default: 3.9,
      //   max , min 最大值最小值校验 适用日期
      max: 5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    rating: { type: Number, default: 4.1 },
    price: { type: Number, required: [true, 'Tour price is required'] },
    priceDiscount: {
      type: Number,
      // 自定义校验 折扣价格不可大于原价
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        // ({VALUE}) mongoose 会自动把当前字段的值传入
        message: 'Discount price ({VALUE}) should be less than the regular price.',
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

// 文档 中间件 pre 保存 创建之前执行 .save() .create()  update 不会执行
TourShema.pre('save', function (next) {
  console.log('first  pre save middleware');
  this.slug = slugify(this.name, { lower: true });

  next();
});

// 某个事件执行后执行 post
// TourShema.post('save', (doc, next) => {
//   console.log('this is post save middleware', this, doc);
//   next();
// });
//
// // 执行顺序 save 的pre  > save的post > update的pre > update的post
// TourShema.pre('save', (next) => {
//   console.log('will save document...');
//   next();
// });

TourShema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // 添加属性
  this.startTime = Date.now();
  next();
});
TourShema.post(['find', 'findOne'], function (docs, next) {
  console.info(`time is ${Date.now() - this.startTime} ms`);
  next();
});

TourShema.post('create', (doc, next) => {
  console.log('this is post create middleware', doc);
  next();
});

TourShema.pre('aggregate', function (next) {
  // 给 聚合查询的 管道 添加 排除 secretTour 为true的条件
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
//  虚拟属性 通过数据库中真实字段 计算出的属性， 通过getter获取 不能通过虚拟属性进行查询数据库 find xxx
TourShema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', TourShema);

module.exports = Tour;
