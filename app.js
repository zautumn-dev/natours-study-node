const express = require('express');
const morgan = require('morgan');

const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');

const app = express();

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  // morgan 日志中间件
  app.use(morgan('dev'));
}

// TODO 中间件
// json 读取请求体body中的值 static 读取静态文件目录中间件
app.use(express.json()).use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello from the middleware 👋');

  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// 所有路由都匹配不到时 对其他未识别的路由进行处理 . 定义 404 错误传递给最后的错误处理中间件
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 404,
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  const e = new Error(`Can't find ${req.originalUrl} on this server!`);
  e.statusCode = 404;
  e.status = '404';

  next(e);
});

// 错误处理
app.use((err, req, res, next) => {
  err.statusCode ||= 500; // 逻辑或赋值（x ||= y）运算仅在 x 为假值时为其赋值
  err.status ||= '500'; // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
