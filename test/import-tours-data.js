const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const mongoose = require('mongoose');
const { createReadStream } = require('node:fs');
const { resolve } = require('node:path');
const Tour = require('../models/tour');

// 识别.env中${}内容
dotenvExpand.expand(
  dotenv.config({
    path: resolve(__dirname, '..', '.env'),
  }),
);

async function connectDatabase() {
  try {
    // 连接数据库
    const mongo = await mongoose.connect(process.env.DATABASE_ADDRESS, {
      // 连接数据库设置从默认admin数据库中认证
      authSource: 'admin',
    });

    if (mongo) {
      console.log('mongoDB 连接成功 ✌️');

      return mongo;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function importTours() {
  return new Promise((resolve) => {
    try {
      // const chunks = [];
      let toursStr = '';

      // 加载json文件
      const readable = createReadStream(`${__dirname}/tours-simple-template.json`, { encoding: 'utf8' });

      readable.on('data', (chunk) => {
        // chunks.push(chunk);
        toursStr += chunk;
      });
      readable.on('end', async () => {
        // 读取为二进制时使用connect 拼接成完整Buffer
        // console.log(JSON.parse(Buffer.concat(chunks).toString('utf-8')));
        // 字符串直接

        await Tour.create(JSON.parse(toursStr));
        resolve();
        console.log('数据新增成功 ✌️');
      });
    } catch (err) {
      console.error(err.message);
    }
  });
}

async function removeTours() {
  const result = await Tour.deleteMany();
  console.log(result, '数据库文档删除成功 ✌️');
}

connectDatabase().then(async (mongo) => {
  if (process.argv[2] === 'import') {
    await importTours();
  } else {
    await removeTours();
  }

  await mongo.disconnect();
  console.log('数据库连接关闭成功 ✌️');
});
