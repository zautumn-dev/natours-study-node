const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const mongoose = require('mongoose');

// 识别.env中${}内容
dotenvExpand.expand(
  dotenv.config({
    path: ['.env', 'config.env'],
  }),
);

const port = process.env.PORT || 1000;

const app = require('./app');

const connectWithRetry = async () => {
  try {
    const mongo = await mongoose.connect(process.env.DATABASE_ADDRESS, {
      authSource: 'admin',
    });

    if (mongo) {
      console.log('mongoDB 连接成功 ✌️');
      console.log(`app is running on: http://localhost:${port}`);
    }
  } catch (e) {
    console.log('数据库连接失败，稍后重试...', e.message);
    setTimeout(connectWithRetry, 10);
  }
};

app.listen(port, connectWithRetry);
