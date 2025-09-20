const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const mongoose = require('mongoose');
const { createReadStream } = require('node:fs');
const { resolve } = require('node:path');
const path = require('node:path');

const needChangeModel = [
  { model: require('../models/tour'), fileName: 'tours' },
  { model: require('../models/user'), fileName: 'users' },
  { model: require('../models/review'), fileName: 'reviews' },
];

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

async function importTours(Model, fileName) {
  return new Promise((resolve) => {
    try {
      const chunks = [];
      // let toursStr = '';

      // 加载json文件  字符串方式 { encoding: 'utf8' }
      // buffer方式
      const readable = createReadStream(path.resolve(__dirname, '..', `./dev-data/data/${fileName}.json`));

      readable.on('data', (chunk) => {
        chunks.push(chunk);
        // toursStr += chunk;
      });
      readable.on('end', async () => {
        // 读取为二进制时使用connect 拼接成完整Buffer
        await Model.create(JSON.parse(Buffer.concat(chunks).toString('utf-8')), { validateBeforeSave: false });
        // 字符串直接
        // await Tour.create(JSON.parse(toursStr));
        resolve();
        console.log('数据新增成功 ✌️ -> ', fileName);
      });
    } catch (err) {
      console.error(err.message);
    }
  });
}

async function removeTours(Model) {
  const result = await Model.deleteMany();
  console.log(result, '数据库文档删除成功 ✌️');
}

function createPromises(fn) {
  return needChangeModel.map((item) => fn(item.model, item.fileName));
}

connectDatabase().then(async (mongo) => {
  let promises = [];

  if (process.argv[2] === 'import') {
    promises = createPromises(importTours);
  } else {
    promises = createPromises(removeTours);
  }

  await Promise.all(promises);

  await mongo.disconnect();
  console.log('数据库连接关闭成功 ✌️');
});
