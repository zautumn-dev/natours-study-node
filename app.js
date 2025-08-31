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

module.exports = app;
