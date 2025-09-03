const Tour = require('../models/tour');
const { all } = require('express/lib/application');

function filterQueryFields(allowFields = [], query) {
  const fieldsStr = JSON.stringify(
    allowFields.reduce((obj, field) => {
      const val = Reflect.get(query, field);
      if (val) {
        Reflect.set(obj, field, val);
        Reflect.deleteProperty(query, field);
      }

      return obj;
    }, {}),
  );

  return JSON.parse(fieldsStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));
}
class APIFeature {
  constructor(query, queryOperate) {
    this.query = query;
    this.queryOperate = queryOperate;
  }

  filter() {
    console.log(this.query);
    // 按照Field 的值查询
    const queryFields = filterQueryFields(Object.keys(this.query.schema.obj), this.queryOperate);
    this.query = this.query.find(queryFields);

    return this;
  }

  sort() {
    // sorting
    this.query = this.query.sort(this.queryOperate.sort ? this.queryOperate.sort.split(',').join(' ') : '-createdAt');
    return this;
  }

  select() {
    // 过滤只需要的 fields
    this.query = this.query.select(
      this.queryOperate.fields ? `${this.queryOperate.fields.split(',').join(' ')} _id` : '-__v',
    );

    return this;
  }

  pagination() {
    // 分页
    const pageSize = this.queryOperate.pageSize ?? 5;
    const skip = ((this.queryOperate.page ?? 1) - 1) * pageSize;
    this.query = this.query.skip(skip).limit(pageSize);

    return this;
  }
}

module.exports = APIFeature;
