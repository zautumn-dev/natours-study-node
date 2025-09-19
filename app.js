const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');
const AppError = require('./utils/appError');
const errorhandler = require('./controller/error');

const app = express();

// 设置express安全头部
app.use(helmet());

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  // morgan 日志中间件
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// 限制 /api 路由下 一小时最多请求100次 一个ip 会在响应头中添加 X-RateLimit-Limit  X-RateLimit-Remaining
app.use('/api', limiter);

// TODO 中间件
// json 读取请求体body中的值 static 读取静态文件目录中间件
app
  .use(express.json())
  .use(mongoSanitize())
  .use(xss())
  .use(
    hpp({
      whitelist: ['duration', 'price'],
    }),
  );

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello from the middleware 👋');

  next();
});

app.use((req, res, next) => {
  // 转换成标准iso 时间字符串
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// 所有路由都匹配不到时 对其他未识别的路由进行处理 . 定义 404 错误传递给最后的错误处理中间件
app.all('*', (req, res, next) => {
  const e = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(e);
});

// 错误处理 兜底错误处理中间件
app.use(errorhandler);

module.exports = app;
