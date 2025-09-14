const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const mongoose = require('mongoose');

// 根据不同环境读取相应env文件
const ENV_FILE_NAME = `.config.env.${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`;

// 识别.env中${}内容
dotenvExpand.expand(
  dotenv.config({
    path: ['.env', ENV_FILE_NAME],
  }),
);

const port = process.env.PORT || 1000;

const app = require('./app');

const connectWithRetry = async () => {
  // try {
  const mongo = await mongoose.connect(process.env.DATABASE_ADDRESS, {
    authSource: 'admin',
  });

  if (mongo) {
    console.log('mongoDB 连接成功 ✌️');
    console.log(`app is running on: http://localhost:${port}`);
  }
  // } catch (e) {
  //   console.log('数据库连接失败，稍后重试...', e.message);
  //   setTimeout(connectWithRetry, 10);
  // }
};

const server = app.listen(port, connectWithRetry);

// 捕获程序中未处理的 promise reject 事件
// https://nodejs.org/docs/latest/api/process.html#event-unhandledrejection
process.on('unhandledRejection', (err) => {
  console.error(err.message, err.name);
  console.log('unhandledRejection event occurred. stopping the server...');

  server.close(() => process.exit(1));
});

//  捕获程序中同步代码错误
process.on('uncaughtException', (err) => {
  console.error(err.message, err.name);
  console.log('uncaughtException event occurred. stopping the server...');
  server.close(() => process.exit(1));
});
